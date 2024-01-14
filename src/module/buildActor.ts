import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { CLASS_LEVEL, LOG_PREFIX, MODULE_ID, MYSTERY_MAN, STEP_INDEX } from './constants';
import { HitDie, HpCalculation } from './hitDie';
import { IndexEntry } from './indexes/entries/indexEntry';
import { hydrateItems } from './indexes/indexUtils';
import SettingKeys from './settings';
import HeroOption from './options/heroOption';
import { Step } from './tabs/step';
import { getModuleSetting } from './utils';

export async function buildActor(steps: Array<Step>): Promise<void> {
  console.info(`${LOG_PREFIX} | Building actor - data used:`);
  const newActorData = _initializeActorData();

  for (const step of steps) {
    for (const opt of step.getOptions()) {
      if (_requiredOptionNotFulfilled(opt)) return;
      await opt.applyToHero(newActorData);
    }
  }

  // calculate whatever needs inter-tab values like HP
  const classUpdateData = steps[STEP_INDEX.Class].getUpdateData();
  _cleanUpErroneousItems(newActorData);
  _setTokenSettings(newActorData);
  const itemsFromActor = newActorData.items; // moving item index entries to a different variable
  newActorData.items = [];
  const ActorClass = getDocumentClass('Actor');
  const actor = new ActorClass(newActorData);

  const newActor = await Actor.create(actor.toObject());
  if (!newActor) {
    ui.notifications?.error(game.i18n.format('HCT.Error.ActorCreationError', { name: newActorData?.name }));
    return;
  }
  const itemsFromCompendia = await hydrateItems(itemsFromActor); // hydrating index entries for the actual items
  const itemsWithoutAdvancements = _keepItemsWithoutAdvancements(itemsFromCompendia);
  const createdItems = await newActor.createEmbeddedDocuments('Item', itemsWithoutAdvancements as any); // adding items after actor creation to process active effects

  const itemsWithAdvancements: Item[] = [];

  const classItem = _getItemOfType(itemsFromCompendia, 'class');
  if (classItem) {
    _setClassLevel(classItem, _getLevelFromClass(classUpdateData));
    await _setHpAdvancement(classItem, classUpdateData);
    itemsWithAdvancements.push(_buildItemGrantAdvancements(classItem, createdItems));
  }
  const subclassItem = _getItemOfType(itemsFromCompendia, 'subclass');
  if (subclassItem) itemsWithAdvancements.push(_buildItemGrantAdvancements(subclassItem, createdItems));

  const backgroundItem = _getItemOfType(itemsFromCompendia, 'background');
  if (backgroundItem) itemsWithAdvancements.push(_buildItemGrantAdvancements(backgroundItem, createdItems));
  await newActor.createEmbeddedDocuments('Item', itemsWithAdvancements as any); // adding the class after Advancements have been filled in

  try {
    await (newActor as any).longRest({ dialog: false, chat: false, newDay: true });
  } catch (error) {
    console.error(error);
  }
}

function _initializeActorData() {
  const newActor: ActorDataConstructorData & { items: IndexEntry[] } = {
    name: '',
    type: 'character',
    sort: 12000,
    img: MYSTERY_MAN,
    token: {
      actorLink: true,
      disposition: 1,
      img: MYSTERY_MAN,
      vision: true,
      dimSight: 0,
      bar1: { attribute: 'attributes.hp' },
      displayBars: 0,
      displayName: 0,
    },
    items: [],
  };
  return newActor;
}

function _requiredOptionNotFulfilled(opt: HeroOption): boolean {
  const key = opt.key;
  if (key === 'name' && !opt.isFulfilled()) {
    const errorMessage = game.i18n.format('HCT.Error.RequiredOptionNotFulfilled', { opt: opt.key });
    ui.notifications?.error(errorMessage);
    return true;
  }
  return false;
}

function _cleanUpErroneousItems(newActor: ActorDataConstructorData) {
  let items = getProperty(newActor, 'items');
  items = items?.filter(Boolean); // filter undefined items
  if (items) setProperty(newActor, 'items', items);
  else delete newActor.items;
}

function _setTokenSettings(newActor: ActorDataConstructorData) {
  const displayBarsSetting = game.settings.get(MODULE_ID, SettingKeys.TOKEN_BAR);
  setProperty(newActor, 'token.displayBars', displayBarsSetting);

  const displayNameSetting = game.settings.get(MODULE_ID, SettingKeys.TOKEN_NAME);
  setProperty(newActor, 'token.displayName', displayNameSetting);

  const dimSight = (newActor?.data as any)?.attributes?.senses?.darkvision ?? 0;
  setProperty(newActor, 'token.dimSight', dimSight);
}

function _keepItemsWithoutAdvancements(itemsFromCompendia: Item[]) {
  const typesWithAdvancements = ['class', 'subclass', 'background'];
  return itemsFromCompendia.filter((i) => !typesWithAdvancements.includes(i.type));
}

function _getItemOfType(itemsFromCompendia: Item[], itemType: 'class' | 'subclass' | 'background') {
  return itemsFromCompendia.find((i) => i.type === itemType)!;
}

function _buildItemGrantAdvancements(itemWithAdvancements: Item, createdItems?: any) {
  (itemWithAdvancements as any).system.advancement = (itemWithAdvancements as any).system.advancement.map((a: any) => {
    if (a.type !== 'ItemGrant') return a;

    a.configuration.items.forEach((itemUuid: string) => {
      const linkedItem = createdItems.find((i: any) => i?.flags?.core?.sourceId === itemUuid);
      if (linkedItem) {
        if (!a.value.added) a.value.added = {};
        a.value.added[linkedItem.id] = itemUuid;
      }
    });
    return a;
  });
  return itemWithAdvancements;
}

function _getLevelFromClass(updateData: any): number {
  return updateData?.level ?? 0;
}

function _setClassLevel(item: Item, classLevel: number) {
  (item as any).system.levels = classLevel;
  return item;
}

async function _setHpAdvancement(classItem: Item, classUpdateData: any) {
  const hitDie: HitDie = classUpdateData?.hitDie;
  const startingLevel: CLASS_LEVEL = classUpdateData?.level || 1;
  const method: HpCalculation = classUpdateData?.hpMethod || 'avg';

  const advancement = (classItem as any).system.advancement.find((adv: any) => adv.type === 'HitPoints');

  if (!advancement) {
    ui.notifications?.warn(
      game.i18n.format('HCT.Class.HitPointsAdvancementMissingError', { className: classItem.name }),
    );
    return;
  }

  const hp: { [level: number]: number | 'max' | 'avg' } = { 1: 'max' };

  for (let lv = 2; lv <= startingLevel; lv++) {
    if (method === 'avg') {
      hp[lv] = 'avg';
      continue;
    }

    const roll = await new Roll(`${hitDie.getVal()}`).evaluate({ async: true });
    if (getModuleSetting(SettingKeys.SHOW_ROLLS_AS_MESSAGES)) {
      roll.toMessage({ flavor: game.i18n.format('HCT.Class.HpRollChatFlavor', { lv }) });
    }
    hp[lv] = parseInt(roll.result);
  }
  advancement.value = hp;
}

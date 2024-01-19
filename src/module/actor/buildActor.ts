import { LOG_PREFIX } from '../constants';
import { hydrateItems } from '../indexes/indexUtils';
import { Step } from '../tabs/step';
import { setTokenSettings } from './setTokenSettings';
import { cleanUndefinedItems } from './cleanUndefinedItems';
import { itemHasAdvancements } from './itemHasAdvancements';
import { buildConfiguredAdvancement } from './buildConfiguredAdvancement';
import { initializeActorData } from './initializeActorData';
import { requiredOptionNotFulfilled } from './requiredOptionNotFulfilled';

export async function buildActor(steps: Array<Step>): Promise<boolean> {
  console.info(`${LOG_PREFIX} | Building actor - data used:`);
  const newActorData = initializeActorData();

  for (const step of steps) {
    for (const opt of step.getOptions()) {
      if (requiredOptionNotFulfilled(opt)) return false;
      await opt.applyToHero(newActorData);
    }
  }

  // calculate whatever needs inter-tab values like HP
  // const classUpdateData = steps[STEP_INDEX.Class].getUpdateData();
  cleanUndefinedItems(newActorData);
  setTokenSettings(newActorData);

  const itemIndexEntriesFromActor = newActorData.items; // moving item index entries to a different variable
  newActorData.items = [];

  const ActorClass = getDocumentClass('Actor');
  const actor = new ActorClass(newActorData);

  const newActor = await Actor.create(actor.toObject());
  if (!newActor) {
    ui.notifications?.error(game.i18n.format('HCT.Error.ActorCreationError', { name: newActorData?.name }));
    return false;
  }

  const itemsFromCompendia = await hydrateItems(itemIndexEntriesFromActor); // hydrating index entries for the actual items
  // const itemsWithoutAdvancements = itemsFromCompendia.filter(_itemsWithoutAdvancements);
  // const itemsWithAdvancements = itemsFromCompendia.filter(_itemsWithAdvancements) as (Item & {
  //   system: { advancement: Advancement[] };
  // })[];

  // const createdItems = await newActor.createEmbeddedDocuments('Item', itemsWithoutAdvancements as any); // adding items after actor creation to process active effects

  const itemsWithAdvancements = itemsFromCompendia.filter(itemHasAdvancements).map((item) => {
    console.log('item pre: ', item);
    // FIXME: maybe not make this nasty workaround ?
    const step = steps.find((s) => s.step === item.type); // for Race items fetches 'race' step, etc
    const stepAdvancementOptions = step!.getOptions().filter((opt: any) => opt.settings.advancement);

    item.system.advancement = item.system.advancement.map((adv) =>
      buildConfiguredAdvancement(adv, stepAdvancementOptions),
    );

    return item;
  });

  // const classItem = _getItemOfType(itemsFromCompendia, 'class');
  // if (classItem) {
  //   _setClassLevel(classItem, _getLevelFromClass(classUpdateData));
  //   await _setHpAdvancement(classItem, classUpdateData);
  //   itemsWithAdvancements.push(_buildItemGrantAdvancements(classItem, createdItems));
  // }
  // const subclassItem = _getItemOfType(itemsFromCompendia, 'subclass');
  // if (subclassItem) itemsWithAdvancements.push(_buildItemGrantAdvancements(subclassItem, createdItems));

  // const backgroundItem = _getItemOfType(itemsFromCompendia, 'background');
  // if (backgroundItem) itemsWithAdvancements.push(_buildItemGrantAdvancements(backgroundItem, createdItems));

  await newActor.createEmbeddedDocuments('Item', itemsWithAdvancements as any); // adding the class after Advancements have been filled in

  try {
    await (newActor as any).longRest({ dialog: false, chat: false, newDay: true });
  } catch (error) {
    console.error(error);
    return false;
  }

  return true; // actor created successfully
}

// function _getItemOfType(itemsFromCompendia: Item[], itemType: 'race' | 'class' | 'subclass' | 'background') {
//   return itemsFromCompendia.find((i) => i.type === itemType)!;
// }

// function _buildItemGrantAdvancements(itemWithAdvancements: Item, createdItems?: any) {
//   (itemWithAdvancements as any).system.advancement = (itemWithAdvancements as any).system.advancement.map(
//     (adv: any) => {
//       if (adv.type !== 'ItemGrant') return adv;
//       adv.configuration.items.forEach((itemUuid: string) => {
//         const linkedItem = createdItems.find((i: any) => i?.flags?.core?.sourceId === itemUuid);
//         if (linkedItem) {
//           if (!adv.value.added) adv.value.added = {};
//           adv.value.added[linkedItem.id] = itemUuid;
//         }
//       });
//       return adv;
//     },
//   );
//   return itemWithAdvancements;
// }

// function _getLevelFromClass(updateData: any): number {
//   return updateData?.level ?? 0;
// }

// function _setClassLevel(item: Item, classLevel: number) {
//   (item as any).system.levels = classLevel;
//   return item;
// }

// async function _setHpAdvancement(classItem: Item, classUpdateData: any) {
//   const hitDie: HitDie = classUpdateData?.hitDie;
//   const startingLevel: CLASS_LEVEL = classUpdateData?.level || 1;
//   const method: HpCalculation = classUpdateData?.hpMethod || 'avg';
//   const advancement = (classItem as any).system.advancement.find((adv: any) => adv.type === 'HitPoints');
//   if (!advancement) {
//     ui.notifications?.warn(
//       game.i18n.format('HCT.Class.HitPointsAdvancementMissingError', { className: classItem.name }),
//     );
//     return;
//   }
//   const hp: { [level: number]: number | 'max' | 'avg' } = { 1: 'max' };
//   for (let lv = 2; lv <= startingLevel; lv++) {
//     if (method === 'avg') {
//       hp[lv] = 'avg';
//       continue;
//     }
//     const roll = await new Roll(`${hitDie.getVal()}`).evaluate({ async: true });
//     if (getModuleSetting(SettingKeys.SHOW_ROLLS_AS_MESSAGES)) {
//       roll.toMessage({ flavor: game.i18n.format('HCT.Class.HpRollChatFlavor', { lv }) });
//     }
//     hp[lv] = parseInt(roll.result);
//   }
//   advancement.value = hp;
// }

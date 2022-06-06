/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import * as Utils from './utils';
import SettingKeys from './settings';

import BasicsTab from './tabs/basicsStep';
import AbilitiesTab from './tabs/abilitiesStep';
import RaceTab from './tabs/raceStep';
import ClassTab from './tabs/classStep';
import BackgroundTab from './tabs/backgroundStep';
import EquipmentTab from './tabs/equipmentStep';
import SpellsTab from './tabs/spellsStep';
import BioTab from './tabs/bioStep';
import { Step } from './step';
import HeroOption from './options/heroOption';
import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { HitDie, HpCalculation } from './hitDie';
import { IndexEntry, hydrateItems } from './indexes/indexUtils';
import { LOG_PREFIX, MODULE_ID, MYSTERY_MAN, CLASS_LEVEL } from './constants';

enum StepIndex {
  Basics,
  Race,
  Class,
  Abilities,
  Background,
  Equipment,
  Spells,
  Bio,
}

export default class HeroCreationTool extends Application {
  actor?: Actor;
  actorName?: string;
  readonly steps: Array<Step>;
  currentTab: StepIndex = StepIndex.Basics;

  constructor() {
    super();
    this.actor = undefined;
    this.steps = [BasicsTab, RaceTab, ClassTab, AbilitiesTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab];
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = `modules/${MODULE_ID}/templates/app.html`;
    options.width = 720;
    options.height = 680;
    options.resizable = true;
    return options;
  }

  async openForNewActor(actorName?: string) {
    this.actor = undefined;
    this.actorName = actorName;
    this.options.title = game.i18n.localize('HCT.CreationWindowTitle');
    console.log(`${LOG_PREFIX} | Opening for new actor${actorName ? ' with name: ' + actorName : ''}`);
    this.steps.forEach((step) => step.clearOptions());
    this.currentTab = -1;
    this.render(true);
  }

  // for level up
  // async openForActor(actor: Actor) {
  //   this.actor = actor;
  //   this.options.title = game.i18n.localize('HCT.CreationWindowTitle');
  //   console.log(`${LOG_PREFIX} | Opening for ${actor.name} (id ${actor.id})`);
  //   this.steps.forEach(step => step.clearOptions());
  //   this.currentTab = -1;
  //   this.render(true);
  // }

  activateListeners() {
    console.log(`${LOG_PREFIX} | Binding listeners`);

    // listeners specific for each tab
    for (const step of this.steps) {
      step.setListeners();
    }

    // set listeners for tab navigation
    $('[data-hct_tab_index]').on('click', (event) => {
      this.currentTab = $(event.target).data('hct_tab_index');
      this.openTab(this.currentTab);
    });
    $('[data-hct_back]').on('click', () => {
      this.currentTab--;
      this.openTab(this.currentTab);
    });
    $('[data-hct_next]').on('click', () => {
      this.currentTab++;
      this.openTab(this.currentTab);
    });
    $('[data-hct_submit]').on('click', () => this.confirmSubmittion());

    this.openTab(-1);
  }

  async setupData() {
    console.log(`${LOG_PREFIX} | Setting up data-derived elements`);
    for (const step of this.steps) {
      await step.setSourceData();
    }
  }

  renderChildrenData() {
    for (const step of this.steps) {
      step.renderData({ actorName: this.actorName });
    }
  }

  private async confirmSubmittion() {
    new Dialog({
      title: game.i18n.localize('HCT.Submit.Title'),
      content: game.i18n.localize('HCT.Submit.Content'),
      buttons: {
        yes: {
          icon: "<i class='fas fa-check'></i>",
          label: game.i18n.localize('HCT.Submit.YesLabel'),
          callback: () => {
            this.buildActor();
          },
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: game.i18n.localize('HCT.Submit.NoLabel'),
        },
      },
      default: 'yes',
    }).render(true);
  }

  private async buildActor() {
    console.log(`${LOG_PREFIX} | Building actor - data used:`);
    const newActorData = this.initializeActorData();
    let errors = false;
    // yeah, a loop label, sue me.
    mainloop: for (const step of this.steps) {
      for (const opt of step.getOptions()) {
        if (this.requiredOptionNotFulfilled(opt)) {
          errors = true;
          break mainloop;
        }
        await opt.applyToHero(newActorData);
      }
    }
    if (!errors) {
      // calculate whatever needs inter-tab values like HP
      cleanUpErroneousItems(newActorData);
      await calculateStartingHp(newActorData, this.steps[StepIndex.Class].getUpdateData());
      setTokenSettings(newActorData);
      const itemsFromActor = newActorData.items; // moving item index entries to a different variable
      newActorData.items = [];
      const cls = getDocumentClass('Actor');
      const actor = new cls(newActorData);

      const newActor = await Actor.create(actor.toObject());
      if (!newActor) {
        ui.notifications?.error(game.i18n.format('HCT.Error.ActorCreationError', { name: newActorData?.name }));
        return;
      }
      const itemsFromCompendia = await hydrateItems(itemsFromActor); // hydrating index entries for the actual items
      setClassLevel(itemsFromCompendia, this.steps[StepIndex.Class].getUpdateData());
      await newActor.createEmbeddedDocuments('Item', itemsFromCompendia as any); // adding items after actor creation to process active effects
      this.close();
    }
  }

  private initializeActorData() {
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

  private requiredOptionNotFulfilled(opt: HeroOption): boolean {
    const key = opt.key;
    if (key === 'name' && !opt.isFulfilled()) {
      const errorMessage = game.i18n.format('HCT.Error.RequiredOptionNotFulfilled', { opt: opt.key });
      ui.notifications?.error(errorMessage);
      return true;
    }
    return false;
  }

  openTab(index: StepIndex): void {
    handleNavs(index);
    $('[data-hct_tab_section]').hide();
    $('[data-hct_tab_index]').removeClass('active');

    $(`[data-hct_tab_section=${index}]`).show();
    $(`[data-hct_tab_index=${index}]`).addClass('active');
    switch (index) {
      case StepIndex.Spells:
        this.steps[StepIndex.Spells].update({ class: this.steps[StepIndex.Class].getUpdateData() });
        break;
      case StepIndex.Abilities:
        this.steps[StepIndex.Abilities].update();
        break;
    }
  }
}

async function calculateStartingHp(newActor: ActorDataConstructorData, classUpdateData: any) {
  const totalCon = getProperty(newActor, 'data.abilities.con.value');
  const conModifier: number = totalCon ? Utils.getAbilityModifierValue(totalCon) : 0;
  if (!classUpdateData) return 10 + conModifier; // release valve in case there's no class selected

  const hitDie: HitDie = classUpdateData?.hitDie;
  const startingLevel: CLASS_LEVEL = classUpdateData?.level;
  const method: HpCalculation = classUpdateData?.hpMethod;

  const startingHp = await hitDie.calculateHpAtLevel(startingLevel, method, conModifier);
  setProperty(newActor, 'data.attributes.hp.max', startingHp);
  setProperty(newActor, 'data.attributes.hp.value', startingHp);
}

function setTokenSettings(newActor: ActorDataConstructorData) {
  const displayBarsSetting = game.settings.get(MODULE_ID, SettingKeys.TOKEN_BAR);
  setProperty(newActor, 'token.displayBars', displayBarsSetting);

  const displayNameSetting = game.settings.get(MODULE_ID, SettingKeys.TOKEN_NAME);
  setProperty(newActor, 'token.displayName', displayNameSetting);

  const dimSight = (newActor?.data as any)?.attributes?.senses?.darkvision ?? 0;
  setProperty(newActor, 'token.dimSight', dimSight);
}

function cleanUpErroneousItems(newActor: ActorDataConstructorData) {
  let items = getProperty(newActor, 'items');
  items = items?.filter(Boolean); // filter undefined items
  if (items) setProperty(newActor, 'items', items);
  else delete newActor.items;
}

function handleNavs(index: number) {
  // hides the nav if switching to startDiv, else show them.
  $('#hct_nav').toggle(index !== -1);

  // disables back/next buttons where appropriate
  const $footer = $('#hct_footer');
  $('[data-hct_back]', $footer).prop('disabled', index < StepIndex.Basics);
  $('[data-hct_next]', $footer).prop('disabled', index >= StepIndex.Bio);
}

function setClassLevel(itemsFromCompendia: Item[], classData: any) {
  const classItem = itemsFromCompendia.find((i) => i.type === 'class');
  if (classItem) {
    (classItem as any).data.levels = classData.level;
  }
}

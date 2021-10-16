/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import * as CONSTANTS from './constants';
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
import { Step } from './Step';
import HeroOption from './options/HeroOption';
import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { HitDie } from './HitDie';
import { ClassLevel } from './ClassLevel';

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
  readonly steps: Array<Step>;
  currentTab: StepIndex = StepIndex.Basics;

  constructor() {
    super();
    this.actor = undefined;
    this.steps = [BasicsTab, RaceTab, ClassTab, AbilitiesTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab];
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = CONSTANTS.MODULE_PATH + '/templates/app.html';
    options.width = 720;
    options.height = 680;
    options.resizable = true;
    return options;
  }

  async openForActor(actor?: Actor) {
    this.actor = actor;
    this.options.title = game.i18n.localize('HCT.WindowTitle');
    const openMessage = actor ? `${actor.name} (id ${actor.id})` : `new actor`;
    console.log(`${CONSTANTS.LOG_PREFIX} | Opening for ${openMessage}`);
    for (const step of this.steps) {
      step.clearOptions();
    }
    this.currentTab = -1;
    this.render(true);
  }

  activateListeners() {
    console.log(`${CONSTANTS.LOG_PREFIX} | Binding listeners`);

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
    $('[data-hct_submit]').on('click', () => this.buildActor());

    this.openTab(-1);
  }

  async setupData() {
    for (const step of this.steps) {
      await step.setSourceData();
    }
  }

  renderChildrenData() {
    for (const step of this.steps) {
      step.renderData();
    }
  }

  private async buildActor() {
    console.log(`${CONSTANTS.LOG_PREFIX} | Building actor - data used:`);
    const newActorData: ActorDataConstructorData = this.initializeActorData();
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
      setTokenDisplaySettings(newActorData);
      const itemsFromActor = newActorData.items; // moving items to a different object to process active effects
      newActorData.items = [];
      const cls = getDocumentClass('Actor');
      const actor = new cls(newActorData);

      const newActor = await Actor.create(actor.toObject());
      if (!newActor) {
        ui.notifications?.error(game.i18n.format('HCT.Error.ActorCreationError', { name: newActorData?.name }));
        return;
      }
      await newActor.createEmbeddedDocuments('Item', itemsFromActor as any);
      this.close();
    }
  }

  private initializeActorData(): ActorDataConstructorData {
    const newActor: ActorDataConstructorData = {
      name: '',
      type: 'character',
      sort: 12000,
      img: CONSTANTS.MYSTERY_MAN,
      token: {
        actorLink: true,
        disposition: 1,
        img: CONSTANTS.MYSTERY_MAN,
        vision: true,
        dimSight: 0,
        bar1: { attribute: 'attributes.hp' },
        displayBars: 0,
        displayName: 0,
      },
    };
    return newActor;
  }

  private requiredOptionNotFulfilled(opt: HeroOption): boolean {
    const key = opt.key;
    if (key === 'name' && !opt.isFulfilled()) {
      // TODO consider if it would make sense to include a filter to make sure a race and class has been selected
      // on Foundry the only *required* field to create an actor is Name, as seen on Foundry's vanilla new actor window.
      const errorMessage = game.i18n.format('HCT.Error.RequiredOptionNotFulfilled', { opt: opt.key });
      ui.notifications?.error(errorMessage);
      return true;
    }
    return false;
  }

  openTab(index: StepIndex): void {
    handleNavs(index);
    $('.tab-body').hide();
    $('.tablinks').removeClass('active');
    $(`[data-hct_tab_index=${index}]`).addClass('active');
    $(`[data-hct_tab_section=${index}]`).show();
    switch (index) {
      case StepIndex.Spells:
        this.steps[StepIndex.Spells].update({ class: this.steps[StepIndex.Class].getUpdateData() });
        break;
    }
  }
}

async function calculateStartingHp(newActor: ActorDataConstructorData, classUpdateData: any) {
  const totalCon = getProperty(newActor, 'data.abilities.con.value');
  const conModifier: number = totalCon ? Utils.getAbilityModifierValue(totalCon) : 0;
  if (!classUpdateData) return 10 + conModifier; // release valve in case there's no class selected

  const hitDie: HitDie = classUpdateData?.hitDie;
  const startingLevel: ClassLevel = classUpdateData?.level;
  const method: CONSTANTS.HpCalculation = classUpdateData?.hpMethod;

  const startingHp = await hitDie.calculateHpAtLevel(startingLevel, method, conModifier);
  setProperty(newActor, 'data.attributes.hp.max', startingHp);
  setProperty(newActor, 'data.attributes.hp.value', startingHp);
}

function setTokenDisplaySettings(newActor: ActorDataConstructorData) {
  const displayBarsSetting = game.settings.get(CONSTANTS.MODULE_NAME, SettingKeys.TOKEN_BAR);
  const displayNameSetting = game.settings.get(CONSTANTS.MODULE_NAME, SettingKeys.TOKEN_NAME);
  setProperty(newActor, 'token.displayBars', displayBarsSetting);
  setProperty(newActor, 'token.displayName', displayNameSetting);
}

function cleanUpErroneousItems(newActor: ActorDataConstructorData) {
  let items = getProperty(newActor, 'items');
  items = items?.filter(Boolean); // filter undefined items
  if (items) setProperty(newActor, 'items', items);
  else delete newActor.items;
}

function handleNavs(index: number) {
  // hides the tabs if switching to startDiv, else show them.
  $('.hct-container .tabs').toggle(index !== -1);

  // disables back/next buttons where appropriate
  const $footer = $('.hct-container footer');
  $('[data-hct_back]', $footer).prop('disabled', index < StepIndex.Basics);
  $('[data-hct_next]', $footer).prop('disabled', index >= StepIndex.Bio);
}

/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import * as Constants from './constants';
import * as Utils from './utils';
import { Settings } from './settings';

import BasicsTab from './tabs/basicsStep';
import AbilitiesTab from './tabs/abilitiesStep';
import RaceTab from './tabs/raceStep';
import ClassTab from './tabs/classStep';
import BackgroundTab from './tabs/backgroundStep';
import EquipmentTab from './tabs/equipmentStep';
import SpellsTab from './tabs/spellsStep';
import BioTab from './tabs/bioStep';
import { Step } from './Step';
import { HeroOption } from './HeroOption';
import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';

export default class App extends Application {
  actorId?: string;
  readonly steps: Array<Step>;
  currentTab = 0;

  constructor() {
    super();
    this.actorId = undefined;
    this.steps = [BasicsTab, AbilitiesTab, RaceTab, ClassTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab];
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = Constants.MODULE_PATH + '/templates/app.html';
    options.width = 720;
    options.height = 680;
    return options;
  }

  async openForActor(actorId?: string) {
    this.options.title = game.i18n.localize('HCT.WindowTitle');
    console.log(`${Constants.LOG_PREFIX} | Opening for ${actorId ? 'actor id: ' + actorId : 'new actor'}`);
    if (actorId) this.actorId = actorId;
    for (const step of this.steps) {
      step.clearOptions();
    }
    this.currentTab = 0;
    this.render(true);
  }

  activateListeners() {
    console.log(`${Constants.LOG_PREFIX} | Binding listeners`);

    // listeners specific for each tab
    for (const step of this.steps) {
      step.setListeners();
    }

    // set listeners for tab navigation
    $('[data-hct_tab_index]').on('click', (event) => {
      this.currentTab = $(event.target).data('hct_tab_index');
      Utils.openTab(this.currentTab);
    });
    $('[data-hct_back]').on('click', () => {
      this.currentTab--;
      Utils.openTab(this.currentTab);
    });
    $('[data-hct_next]').on('click', () => {
      this.currentTab++;
      Utils.openTab(this.currentTab);
    });
    $('[data-hct_submit]').on('click', () => this.buildActor());

    Utils.openTab(this.currentTab);
  }

  async setupData() {
    for (const step of this.steps) {
      step.setSourceData();
    }
  }

  renderChildrenData() {
    for (const step of this.steps) {
      step.renderData();
    }
  }

  private async buildActor() {
    console.log(`${Constants.LOG_PREFIX} | Building actor`);
    const newActor: ActorDataConstructorData = this.initializeActorData();
    let errors = false;
    // yeah, a loop label, sue me.
    mainloop: for (const step of this.steps) {
      for (const opt of step.getOptions()) {
        if (this.requiredOptionNotFulfilled(opt)) {
          errors = true;
          break mainloop;
        }
        opt.applyToHero(newActor);
      }
    }
    if (!errors) {
      // calculate whatever needs inter-tab values like HP
      calculateStartingHp(newActor);
      setTokenDisplaySettings(newActor);
      console.log(newActor);
      Actor.create({ ...newActor });
      this.close();
    }
  }

  private initializeActorData(): ActorDataConstructorData {
    const newActor: ActorDataConstructorData = {
      name: '',
      type: 'character',
      sort: 12000,
      img: Constants.MYSTERY_MAN,
      token: {
        actorLink: true,
        disposition: 1,
        img: Constants.MYSTERY_MAN,
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
      const errorMessage = game.i18n.format('HCT.Creation.RequiredOptionNotFulfilled', { opt: opt.key });
      ui.notifications?.error(errorMessage);
      return true;
    }
    return false;
  }
}
function calculateStartingHp(newActor: ActorDataConstructorData) {
  const totalCon = getProperty(newActor, 'data.abilities.con.value');
  const raceAndConHp: number = totalCon ? Utils.getAbilityModifierValue(totalCon) : 0;
  const maxHp = getProperty(newActor, 'data.attributes.hp.max');
  const classHp: number = maxHp ? Number.parseInt(maxHp) : 10;

  const startingHp = raceAndConHp + classHp;
  setProperty(newActor, 'data.attributes.hp.max', startingHp);
  setProperty(newActor, 'data.attributes.hp.value', startingHp);
}

function setTokenDisplaySettings(newActor: ActorDataConstructorData) {
  const displayBarsSetting = game.settings.get(Constants.MODULE_NAME, Settings.TOKEN_BAR);
  const displayNameSetting = game.settings.get(Constants.MODULE_NAME, Settings.TOKEN_NAME);
  setProperty(newActor, 'token.displayBars', displayBarsSetting);
  setProperty(newActor, 'token.displayName', displayNameSetting);
}

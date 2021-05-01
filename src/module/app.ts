/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import * as Constants from './constants';
import * as Utils from './utils';
import HeroData from './HeroData';

import BasicsTab from './tabs/basicsStep';
import AbilitiesTab from './tabs/abilitiesStep';
import RaceTab from './tabs/raceStep';
import ClassTab from './tabs/classStep';
import BackgroundTab from './tabs/backgroundStep';
import EquipmentTab from './tabs/equipmentStep';
import SpellsTab from './tabs/spellsStep';
import BioTab from './tabs/bioStep';
import ReviewTab from './tabs/reviewStep';
import { Step } from './Step';
import Race from './types/Race';
import * as DataPrep from './dataPrep';
import { HeroOption } from './HeroOption';

export default class App extends Application {
  newActor: HeroData;
  actorId?: string;
  readonly steps: Array<Step>;
  items: HeroOption[] = [];

  constructor() {
    super();
    this.newActor = new HeroData();
    this.actorId = undefined;
    this.steps = [BasicsTab, AbilitiesTab, RaceTab, ClassTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab]; // review tab holds no data
  }

  static get defaultOptions() {
    const options = super.defaultOptions;
    options.template = Constants.MODULE_PATH + '/templates/app.html';
    options.width = 700;
    options.height = 700;
    options.title = 'Hero Creation';
    return options;
  }

  async openForActor(actorId?: string) {
    console.log(`${Constants.LOG_PREFIX} | Opening for ${actorId ? 'actor id: ' + actorId : 'new actor'}`);
    if (actorId) this.actorId = actorId;
    this.items = [];
    this.render(true, { log: true });
  }

  activateListeners() {
    console.log(`${Constants.LOG_PREFIX} | Binding listeners`);

    // listeners specific for each tab
    for (const step of this.steps) {
      step.setListeners();
    }

    // set listeners for tab navigation
    $('[data-hct_tab]').on('click', function () {
      Utils.openTab($(this).data('hct_tab'));
    });
    $('[data-hct_back]').on('click', function () {
      Utils.openTab($(this).data('hct_back'));
    });
    $('[data-hct_next]').on('click', function () {
      Utils.openTab($(this).data('hct_next'));
    });

    $('[data-hct_review]').on('click', () => {
      ReviewTab.mapReviewItems(this.getHeroOptionsFromSteps());
    });

    $('#finalSubmit').on('click', (event) => {
      this.getHeroOptionsFromSteps();
      //if(confirm(game.i18n.localize("HCT.Race.ReviewErrorConfirm")))
      this.buildActor();
      this.close();
    });
  }

  async setupData() {
    const races: Race[] = await DataPrep.setupRaces();
    RaceTab.setSourceData(races);
  }

  renderChildrenData() {
    for (const step of this.steps) {
      step.renderData();
    }
  }

  private getHeroOptionsFromSteps(): HeroOption[] {
    this.items = [];
    for (const step of this.steps) {
      this.items = this.items.concat(step.getOptions());
    }
    return this.items;
  }

  private buildActor() {
    console.log(`${Constants.LOG_PREFIX} | Building actor`);
    for (const step of this.steps) {
      for (const opt of step.getOptions()) {
        opt.applyToHero(this.newActor);
      }
    }

    // Creates new actor based on collected data
    Actor.create(this.newActor);
  }
}

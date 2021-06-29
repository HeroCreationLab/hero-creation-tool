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
import { Step } from './Step';
import { HeroOption } from './HeroOption';

export default class App extends Application {
  actorId?: string;
  readonly steps: Array<Step>;

  constructor() {
    super();
    this.actorId = undefined;
    this.steps = [BasicsTab, AbilitiesTab, RaceTab, ClassTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab];
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
    for (const step of this.steps) {
      step.clearOptions();
    }
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

    $('[data-hct_submit]').on('click', (event) => {
      this.buildActor();
    });

    Utils.openTab('startDiv');
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
    const newActor = new HeroData();
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
      Actor.create(newActor);
      this.close();
    }
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

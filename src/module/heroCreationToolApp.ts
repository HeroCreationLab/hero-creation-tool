import BasicsTab from './tabs/basicsStep';
import AbilitiesTab from './tabs/abilitiesStep';
import RaceTab from './tabs/raceStep';
import ClassTab from './tabs/classStep';
import BackgroundTab from './tabs/backgroundStep';
import EquipmentTab from './tabs/equipmentStep';
import SpellsTab from './tabs/spellsStep';
import BioTab from './tabs/bioStep';
import { Step } from './tabs/step';
import { LOG_PREFIX, MODULE_ID } from './constants';
import { buildActor } from './buildActor';
import { STEP_INDEX } from './constants';

export default class HeroCreationTool extends Application {
  actor?: Actor;
  actorName?: string;
  readonly steps: Array<Step>;
  currentTab: STEP_INDEX = STEP_INDEX.Basics;

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
    console.info(`${LOG_PREFIX} | Opening for new actor${actorName ? ' with name: ' + actorName : ''}`);
    this.steps.forEach((step) => step.clearOptions());
    this.currentTab = STEP_INDEX.Intro;
    this.render(true);
  }

  // for level up
  // async openForActor(actor: Actor) {
  //   this.actor = actor;
  //   this.options.title = game.i18n.localize('HCT.CreationWindowTitle');
  //   console.info(`${LOG_PREFIX} | Opening for ${actor.name} (id ${actor.id})`);
  //   this.steps.forEach(step => step.clearOptions());
  //   this.currentTab = -1;
  //   this.render(true);
  // }

  activateListeners() {
    console.info(`${LOG_PREFIX} | Binding listeners`);

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

    this.openTab(STEP_INDEX.Intro);
  }

  async setupData() {
    console.info(`${LOG_PREFIX} | Setting up data-derived elements`);
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
          callback: this.handleActorCreation,
        },
        no: {
          icon: "<i class='fas fa-times'></i>",
          label: game.i18n.localize('HCT.Submit.NoLabel'),
        },
      },
      default: 'yes',
    }).render(true);
  }

  private handleActorCreation = async () => {
    buildActor(this.steps);
    this.close();
  };

  private openTab(index: STEP_INDEX): void {
    _handleNavs(index);
    $('[data-hct_tab_section]').hide();
    $('[data-hct_tab_index]').removeClass('active');

    $(`[data-hct_tab_section=${index}]`).show();
    $(`[data-hct_tab_index=${index}]`).addClass('active');
    switch (index) {
      case STEP_INDEX.Spells:
        this.steps[STEP_INDEX.Spells].update({ class: this.steps[STEP_INDEX.Class].getUpdateData() });
        break;
      case STEP_INDEX.Abilities:
        this.steps[STEP_INDEX.Abilities].update();
        break;
    }
  }
}

function _handleNavs(index: number) {
  // hides the nav if switching to startDiv, else show them.
  $('#hct_nav').toggle(index !== STEP_INDEX.Intro);

  // disables back/next buttons where appropriate
  const $footer = $('#hct_footer');
  $('[data-hct_back]', $footer).prop('disabled', index < STEP_INDEX.Basics);
  $('[data-hct_next]', $footer).prop('disabled', index >= STEP_INDEX.Bio);
}

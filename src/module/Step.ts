import HeroOption from './options/HeroOption';

export abstract class Step {
  readonly step: StepEnum;
  protected readonly stepOptions: HeroOption[];

  constructor(step: StepEnum) {
    this.step = step;
    this.stepOptions = [];
  }

  /**
   * Delegation method for this tab to set its own listeners when Application.activateListeners()
   * is called. Here all HTML event listeners should be registered.
   */
  setListeners(): void {
    return;
  }

  /**
   * Method called by the Application for each tab to provide any specific
   * data this tab might need. Called during the **first** 'renderApp' Hook.
   *
   * Might not be needed for every tab.
   */
  setSourceData(): void {
    return;
  }

  /**
   * Method called by the Application for each tab to render their internal HTML.
   * Called at the end of every 'renderApp' Hook.
   */
  renderData(data?: any): void {
    return;
  }

  /**
   * Method called by the Application when on final submit,
   * for every tab to return their options.
   *
   * Some options might be defined before, this method been the last chance to created
   * HeroOptions derived from data, for example on the Abilities tab.
   *
   * By default returns stepOptions, but should be overloaded as needed.
   */
  getOptions(): HeroOption[] {
    return this.stepOptions;
  }

  /**
   * Method called when another tab needs data from this one, to abstract the internal complexities
   */
  getUpdateData(): any {
    throw Error('getUpdateData() not implemented in step ' + this.constructor.name);
  }

  /**
   * Method called when switching to this tab, useful when trying to update this tab's content based on external data
   * e.g. Updating Spells' spellcasting ability based on Class
   */
  update(data: any): void {
    throw Error('update() not implemented in step ' + this.constructor.name);
  }

  clearOptions(): void {
    this.stepOptions.splice(0, this.stepOptions.length);
  }

  /**
   * Helper method that returns the JQuery element representing this tab's entire section.
   */
  abstract section(): JQuery;
}

export enum StepEnum {
  Basics = 'basics',
  Race = 'race',
  Class = 'class',
  Abilities = 'abilities',
  Background = 'background',
  Equipment = 'equipment',
  Spells = 'spells',
  Biography = 'bio',
}

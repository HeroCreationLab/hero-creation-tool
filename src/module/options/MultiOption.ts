import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import SelectableOption from './SelectableOption';
import HeroOption, { apply } from './HeroOption';
import InputOption from './TextInputOption';

/**
 * Represents an array of values selected by the player for the created actor.
 * (e.g. A class allowing to pick 2 skills from a list)
 * @class
 */
export default class MultiOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private options: { key: string; value: string }[],
    private quantity: number,
    private label: string,
    readonly settings: {
      addValues: boolean;
      expandable?: boolean;
      customizable?: boolean;
    } = { addValues: false, expandable: false, customizable: false },
  ) {}

  isFulfilled() {
    return this.value().length > 0;
  }

  applyToHero(actor: ActorDataConstructorData) {
    this.optionList.forEach((v) => apply(actor, v.key, v.value(), this.settings.addValues));
  }

  optionList!: HeroOption[];
  $buttonGroup!: JQuery;

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} $p
   */
  render($parent: JQuery): void {
    this.optionList = [];
    for (let i = 0; i < this.quantity; i++) {
      const o = new SelectableOption(this.origin, this.key, this.options, this.label, {
        ...this.settings,
        customizable: false,
      });
      this.optionList.push(o);
      o.render($parent);
    }
    if (this.settings.expandable) {
      this.$buttonGroup = $('<div class="hct-options-container-buttongroup">');

      if (this.settings.customizable) {
        const $customButtom = $('<button class="hct-options-container-button">').html(
          `${game.i18n.localize('HCT.Common.AddCustom')}`,
        );
        $customButtom.on('click', () => this.addCustomOption());
        this.$buttonGroup.append($customButtom);
      }

      const $addButton = $('<button class="hct-options-container-button">').html(
        `${game.i18n.localize('HCT.Common.AddStandard')}`,
      );
      $addButton.on('click', () => this.addOption());
      this.$buttonGroup.append($addButton);

      $parent.append(this.$buttonGroup);
    }
  }

  addOption(): void {
    const o = new SelectableOption(this.origin, this.key, this.options, this.label, {
      ...this.settings,
      customizable: false,
    });
    this.optionList.push(o);
    o.render(this.$buttonGroup, { beforeParent: true });
  }

  addCustomOption(): void {
    const o = new InputOption(this.origin, this.key, '...', this.label, { ...this.settings, type: 'text' });
    this.optionList.push(o);
    o.render(this.$buttonGroup, { beforeParent: true });
  }

  /**
   * @returns the current value of this option
   */
  value(): any[] {
    const values: any[] = [];
    this.optionList.forEach((o) => values.push(o.value()));
    return values;
  }
}

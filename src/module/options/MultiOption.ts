import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import SelectableOption from './SelectableOption';
import HeroOption, { apply } from './HeroOption';

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
    readonly addValues: boolean = false,
    readonly expandable: boolean = false,
  ) {}

  isFulfilled() {
    return this.value().length > 0;
  }

  applyToHero(actor: ActorDataConstructorData) {
    this.optionList.forEach((v) => apply(actor, v.key, v.value(), this.addValues));
  }

  optionList!: SelectableOption[];
  $addButton!: JQuery;

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} $p
   */
  render($parent: JQuery): void {
    this.optionList = [];
    for (let i = 0; i < this.quantity; i++) {
      const o = new SelectableOption(this.origin, this.key, this.options, this.label, this.addValues);
      this.optionList.push(o);
      o.render($parent);
    }
    if (this.expandable) {
      this.$addButton = $('<button class="hct-options-container-button">').html('<i class="fa fa-plus"></i>');
      this.$addButton.on('click', () => this.addOption());
      $parent.append(this.$addButton);
    }
  }

  addOption(): void {
    const o = new SelectableOption(this.origin, this.key, this.options, this.label, this.addValues);
    this.optionList.push(o);
    o.render(this.$addButton, { beforeParent: true });
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

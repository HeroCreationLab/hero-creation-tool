import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';

/**
 * Represents a fixed value that will be imprinted into the created actor
 * (e.g. how all Elves get Perception proficiency)
 * @class
 */
export default class FixedOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private option: any,
    private textToShow: string,
    readonly addValues: boolean = false,
  ) {}

  isFulfilled() {
    return !!this.option;
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(actor, this.key, this.value(), this.addValues);
  }

  private $elem = $('<p class="hct-option">').html(`${this.textToShow}`);

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} parent
   */
  render(parent: JQuery): void {
    parent.append(this.$elem);
  }

  /**
   * @returns the current value of this option
   */
  value(): any {
    return this.option;
  }
}

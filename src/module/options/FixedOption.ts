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
    private option: string | number | Item,
    private textToShow: string,
    readonly settings: {
      addValues: boolean;
      type: OptionType;
    } = { addValues: false, type: OptionType.TEXT },
  ) {}

  isFulfilled() {
    return !!this.option;
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(
      actor,
      this.key,
      this.settings.type === OptionType.TEXT ? this.value() : [this.value()],
      this.settings.addValues,
    );
  }

  private $textElem = $('<p class="hct-option">').html(`${this.textToShow}`);
  private $itemImg = $('<img class="hct-icon">');
  private $itemName = $('<p>');

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} parent
   */
  render(parent: JQuery): void {
    if (this.settings.type === OptionType.TEXT) {
      parent.append(this.$textElem);
    } else {
      const $container = $('<div class="hct-icon-with-context">');
      const item: Item = this.option as Item;
      this.$itemImg.attr('src', item.img);
      this.$itemName.html(item.name as string);
      $container.append(this.$itemImg);
      $container.append(this.$itemName);
      parent.append($container);
    }
  }

  /**
   * @returns the current value of this option
   */
  value(): any {
    return this.option;
  }
}

export enum OptionType {
  TEXT,
  ITEM,
}

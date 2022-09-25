import { StepEnum } from '../step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './heroOption';
import { IndexEntry } from '../indexes/indexUtils';

/**
 * Represents a fixed value that will be imprinted into the created actor
 * (e.g. how all Elves get Perception proficiency)
 * @class
 */
export default class FixedOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private option: string | number | IndexEntry | { cp: number; sp: number; gp: number },
    private textToShow?: string,
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
      this.settings.type === OptionType.TEXT || this.settings.type === OptionType.CURRENCY
        ? this.value()
        : this.settings.type === OptionType.NUMBER
        ? (this.value() as number)
        : [this.value()],
      this.settings.addValues,
      this.settings.type === OptionType.NUMBER,
    );
  }

  private $textElem = $('<p class="hct-option">').html(`${this.textToShow}`);
  private $itemImg = $('<img class="hct-icon hct-border-0 hct-border-rad-tiny hct-hover-shadow-accent">');
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
      const item = this.option as IndexEntry;
      const $link = item.local
        ? $(
            `<a class="content-link hct-icon-link" draggable="false" data-type="Item" data-uuid="${item._uuid}" data-entity="Item">`,
          )
        : $(`<a class="content-link hct-icon-link" draggable="false" data-uuid="${item._uuid}">`);
      this.$itemImg.attr('src', item.img);
      $link.append(this.$itemImg);
      this.$itemName.html(this.textToShow ?? (item.name as string));
      $container.append($link);
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
  NUMBER,
  CURRENCY,
}

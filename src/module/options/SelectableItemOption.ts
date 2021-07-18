import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SelectableItemOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    readonly options: Item[],
    private label: string = '',
    readonly settings: {
      addValues: boolean;
    } = { addValues: true },
  ) {
    this.$elem = $(`<select class="hct-option-select">`);
    $(`<option value="" selected disabled hidden>
      ${game.i18n.localize('HCT.Common.ProficiencySelectPlaceholder')}
      </option>`);

    this.$elem.append(
      this.options.map((option: Item, index: number) => $(`<option value="${index}">${option.name}</option>`)),
    );
  }

  isFulfilled() {
    return !!this.value();
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(actor, this.key, this.value(), this.settings.addValues);
  }

  $elem: JQuery;

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} $parent
   */
  render($parent: JQuery, options?: { beforeParent: boolean }): void {
    const $block = $('<div class="hct-option">');
    if (this.label) {
      $block.append($('<span class="hct-option-label">').text(this.label));
    }
    $block.append(this.$elem);
    if (options?.beforeParent) {
      $parent.before($block);
    } else {
      $parent.append($block);
    }
  }

  /**
   * @returns the current value of this option
   */
  value(): any {
    const index = parseInt(this.$elem.val() as string);
    return [this.options[index]];
  }
}

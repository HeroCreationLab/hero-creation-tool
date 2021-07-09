import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SelectableOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private options: { key: string; value: string }[],
    private label: string,
    readonly settings: {
      addValues: boolean;
    } = { addValues: false },
  ) {}

  isFulfilled() {
    return !!this.value();
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(actor, this.key, this.value(), this.settings.addValues);
  }

  $elem: JQuery = $(`<select class="hct-option-select">
        <option value="" selected disabled hidden>${game.i18n.localize(
          'HCT.Common.ProficiencySelectPlaceholder',
        )}</option>
      ${this.options.map((option) => `<option value="${option.key}">${game.i18n.localize(option.value)}</option>`)}
    </select>`);

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
    return this.$elem.val();
  }
}

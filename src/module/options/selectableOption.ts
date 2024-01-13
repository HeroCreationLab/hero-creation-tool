import { StepEnum } from '../step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './heroOption';

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SelectableOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private options: Record<string, string>[],
    private label: string,
    readonly settings: {
      addValues: boolean;
      default?: string;
      customizable: boolean;
    } = { addValues: false, customizable: false },
    readonly changeCallback?: (data?: any) => void,
    readonly callbackMapping?: Map<string, string>,
  ) {
    this.$elem = $(`<select class="hct-grow">`);
    if (!settings.default) {
      this.$elem.append(
        $(`<option value="" selected disabled hidden>
      ${game.i18n.localize('HCT.Common.SelectPlaceholder')}</option>`),
      );
    }
    if (this.settings.customizable) {
      this.$elem.append(
        $(`<option value="custom">
      ${game.i18n.localize('HCT.Common.SelectCreateOne')}</option>`),
      );
      this.$customValue = $(`<input type="text" placeholder="${game.i18n.localize('HCT.Common.RequiredName')}">`);
      this.$elem.on('change', () => {
        const val = this.$elem.val() as string;
        this.isCustom = val === 'custom';
        this.$customValue.toggle(this.isCustom);
        if (this.isCustom) {
          this.$customValue.val('');
        }
        if (changeCallback) changeCallback(val === 'custom' ? val : this.callbackMapping!.get(val));
      });
    }
    this.$elem.append(
      this.options.map((option) =>
        $(
          `<option value="${option.key}" ${option.key === settings.default ? 'selected' : ''}>${game.i18n.localize(
            option.value,
          )}</option>`,
        ),
      ),
    );
  }

  isCustom = false;

  $customValue!: JQuery;

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
    const $block = $('<div class="hct-option hct-grow">');
    if (this.label) {
      $block.append($('<span class="hct-pr-sm">').text(this.label));
    }
    $block.append(this.$elem);
    const $container = $('<div>');
    if (this.settings.customizable) {
      $container.append($block);
      $container.append($('<div class="hct-option">').append(this.$customValue));
      this.$customValue.hide();
    }
    if (options?.beforeParent) {
      $parent.before(this.settings.customizable ? $container : $block);
    } else {
      $parent.append(this.settings.customizable ? $container : $block);
    }
  }

  /**
   * @returns the current value of this option
   */
  value(): any {
    if (this.settings.customizable && this.$customValue.val()) {
      return this.$customValue.val();
    }
    return this.$elem.val();
  }
}

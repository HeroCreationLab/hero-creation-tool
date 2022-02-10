import { StepEnum } from '../step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import SelectableOption from './selectableOption';
import HeroOption from './hHeroOption';
import InputOption from './iInputOption';
import DeletableOption from './dDeletableOption';

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
    this.optionMap.forEach((v) => v.applyToHero(actor));
  }

  optionMap: Map<string, HeroOption> = new Map<string, HeroOption>();
  $container!: JQuery;

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} $p
   */
  render($parent: JQuery): void {
    this.$container = $(`<div class="hct-options-container">`);
    const $titleDiv = $('<div class="flexrow hct-justify-between hct-w-full" data-hct_opt_container_title>');
    const $title = $(`<p class="hct-grow">${this.label}</p>`);
    $titleDiv.append($title);

    if (this.settings.expandable) {
      const $addButton = $(
        '<button class="hct-border-0 hct-grow-0 hct-bg-inherit hover:hct-shadow-none hct-hover-accent-alt"><i class="fas fa-plus"></i></button>',
      );
      $addButton.on('click', () => {
        if (!this.settings.customizable) {
          this.addOption();
        } else {
          const d = new Dialog({
            title: game.i18n.localize('HCT.Common.ProfDialogTitle'),
            content: `<p>${game.i18n.localize('HCT.Common.ProfDialogContent')}</p>`,
            buttons: {
              standard: {
                label: game.i18n.localize('HCT.Common.AddStandard'),
                callback: () => this.addOption(),
              },
              custom: {
                label: game.i18n.localize('HCT.Common.AddCustom'),
                callback: () => this.addCustomOption(),
              },
            },
            default: 'standard',
          });
          d.render(true);
        }
      });
      $titleDiv.append($addButton);
    }
    this.$container.append($titleDiv);

    this.optionMap = new Map();
    for (let i = 0; i < this.quantity; i++) {
      const o = new SelectableOption(this.origin, this.key, this.options, ' ', {
        ...this.settings,
        customizable: false,
      });
      this.optionMap.set(foundry.utils.randomID(), o);
      o.render(this.$container);
    }

    $parent.append(this.$container);
  }

  addOption(): void {
    const o = new DeletableOption(
      this.origin,
      new SelectableOption(this.origin, this.key, this.options, ' ', {
        ...this.settings,
        customizable: false,
      }),
      { addValues: this.settings.addValues, rightPadding: true },
      (arg: any) => this.onDelete(arg),
      foundry.utils.randomID(),
    );
    this.optionMap.set(foundry.utils.randomID(), o);
    o.render(this.$container);
  }

  addCustomOption(): void {
    const o = new DeletableOption(
      this.origin,
      new InputOption(this.origin, this.key, '...', '', { ...this.settings, type: 'text', preLabel: '' }),
      { addValues: this.settings.addValues, rightPadding: true },
      (arg: any) => this.onDelete(arg),
      foundry.utils.randomID(),
    );
    this.optionMap.set(foundry.utils.randomID(), o);
    o.render(this.$container);
  }

  onDelete(deletableId: string) {
    if (deletableId) {
      $(`#hct_deletable_${deletableId}`, this.$container).remove();
    }
    this.optionMap.delete(deletableId);
  }

  /**
   * @returns the current value of this option
   */
  value(): any[] {
    const values: any[] = [];
    this.optionMap.forEach((o) => values.push(o.value()));
    return values;
  }
}

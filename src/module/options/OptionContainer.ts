import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption from './HeroOption';

/**
 * Represents a fixed value that will be imprinted into the created actor
 * (e.g. how all Elves get Perception proficiency)
 * @class
 */
export default class OptionContainer implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private options: HeroOption[],
    private label?: string,
    readonly settings: {
      addValues: boolean;
      deletable?: boolean;
    } = { addValues: false },
    readonly deleteCallback?: (args?: any) => any,
    readonly callbackParams?: string,
  ) {}

  isFulfilled() {
    return this.options.every((o) => o.isFulfilled());
  }

  applyToHero(actor: ActorDataConstructorData) {
    this.options.forEach((o) => o.applyToHero(actor));
  }

  render($parent: JQuery): void {
    const $container = $(
      `<fieldset style="margin-bottom:10px; border-radius:5px; padding: 5px;" ${
        this.settings.deletable ? 'id="hct_deletable_' + this.callbackParams + '"' : ''
      }>`,
    );
    const $legend = $(`<legend>${this.label || ''}</legend>`);
    $container.append($legend);
    if (this.settings.deletable && this.deleteCallback) {
      const $deleteButton = $(
        `<button class="hct-no-border hct-no-background hct-width-fit hct-hover-no-shadow hct-hover-accent hct-padding-l-small"><i class="fas fa-trash"></i></button>`,
      );
      $deleteButton.on('click', () => {
        this.deleteCallback!(this);
      });
      $legend.append($deleteButton);
    }
    this.options.forEach((o) => o.render($container));
    $parent.append($container);
  }

  /**
   * @returns the current value of this option
   */
  value(): any[] {
    return this.options.map((o) => o.value());
  }
}

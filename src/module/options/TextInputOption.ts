import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';

/**
 * Represents a manually inputed value by the player for the created actor.
 * Expected to be a String, but should be reasonably easy to use it for numbers or expand it for that use.
 * e.g. Hero name
 * @class
 */
export default class TextInputOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private placeholder: string,
    private val: string,
    readonly settings: {
      addValues: boolean;
    } = { addValues: false },
  ) {}

  $elem!: JQuery;

  render($parent: JQuery<HTMLElement>, settings?: { beforeParent: boolean }): void {
    const $container = $('<div class="hct-option">');
    this.$elem = $(`<input type="text" placeholder="${this.placeholder}" value=${this.val}>`);
    $container.append(this.$elem);
    if (settings?.beforeParent) {
      $parent.before($container);
    } else {
      $parent.append($container);
    }
  }

  value() {
    return this.$elem.val();
  }

  isFulfilled(): boolean {
    return !!this.$elem.val();
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(actor, this.key, this.value(), this.settings.addValues);
  }
}

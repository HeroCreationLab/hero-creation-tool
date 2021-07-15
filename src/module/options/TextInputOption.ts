import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';

/**
 * Represents a manually inputed value by the player for the created actor.
 * Expected to be a String, but should be reasonably easy to use it for numbers or expand it for that use.
 * e.g. Hero name
 * @class
 */
export default class InputOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private placeholder: string,
    private val: string | number,
    readonly settings: {
      addValues: boolean;
      type: 'text' | 'number';
      min?: number;
      max?: number;
      preLabel?: string;
      postLabel?: string;
    } = { addValues: false, type: 'text' },
  ) {}

  $elem!: JQuery;

  render($parent: JQuery<HTMLElement>, settings?: { beforeParent: boolean }): void {
    const $container = $('<div class="hct-option">');
    const min = this.settings.min ? `min="${this.settings.min}"` : '';
    const max = this.settings.max ? `max="${this.settings.max}"` : '';

    if (this.settings.preLabel) {
      const $preLabel = $(`<p class='hct-prelabel'>${this.settings.preLabel}</p>`);
      $container.append($preLabel);
    }

    this.$elem = $(`<input type="${this.settings.type}" 
    placeholder="${this.placeholder}" 
    value=${this.val} 
    ${this.settings.type == 'number' ? `${min} ${max}` : ''}
    >`);
    $container.append(this.$elem);

    if (this.settings.postLabel) {
      const $postLabel = $(`<p class='hct-postlabel'>${this.settings.postLabel}</p>`);
      $container.append($postLabel);
    }

    if (settings?.beforeParent) {
      $parent.before($container);
    } else {
      $parent.append($container);
    }
  }

  value(): string | number {
    const val = this.$elem.val();
    if (this.settings.type == 'number') return val as number;
    return val as string;
  }

  isFulfilled(): boolean {
    return !!this.$elem.val();
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(actor, this.key, this.value(), this.settings.addValues, this.settings.type === 'number');
  }
}

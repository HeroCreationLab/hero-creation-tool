import { StepEnum } from '../tabs/step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './heroOption';
import { AdvancementType } from '../advancements/advancementType';

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
      advancement?: { type: AdvancementType; origin: string; exclude: boolean }; // exclude: don't apply this value when applying options
      min?: number;
      max?: number;
      preLabel?: string;
      postLabel?: string;
      class?: string;
      data?: string;
      disabled?: boolean;
    } = { addValues: false, type: 'text' },
  ) {}

  $elem!: JQuery;

  render($parent: JQuery<HTMLElement>, settings?: { beforeParent: boolean }): void {
    const $container = $('<div class="hct-option">');
    const min = this.settings.min ? `min="${this.settings.min}"` : '';
    const max = this.settings.max ? `max="${this.settings.max}"` : '';
    const wrapped = !!this.settings.postLabel;

    if (this.settings.preLabel) {
      const $preLabel = $(`<span class="hct-pr-sm hct-w-6/12">${this.settings.preLabel}</span>`);
      $container.append($preLabel);
    }

    const data = this.settings.data;
    if (wrapped) {
      const $wrapper = $(`<div class="flexrow ${this.settings.class ?? ''}">`);
      this.$elem = $(`<input type="${this.settings.type}" placeholder="${this.placeholder}" ${data ?? ''} 
        value=${this.val} ${this.settings.type == 'number' ? `${min} ${max}` : ''}>`);
      $wrapper.append(this.$elem);

      if (this.settings.postLabel) {
        const $postLabel = $(`<p class='hct-ml-sm'>${this.settings.postLabel}</p>`);
        $wrapper.append($postLabel);
      }
      $container.append($wrapper);
    } else {
      this.$elem = $(`<input 
        class="${this.settings.class ?? ''}"
        type="${this.settings.type}"
        placeholder="${this.placeholder}"
        ${data ?? ''}  
        value=${this.val}
        ${this.settings.type == 'number' ? `${min} ${max}` : ''}
        ${this.settings.disabled ? 'disabled' : ''}>`);
      $container.append(this.$elem);
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
    if (this.settings.advancement?.exclude) return;
    apply(actor, this.key, this.value(), this.settings.addValues, this.settings.type === 'number');
  }
}

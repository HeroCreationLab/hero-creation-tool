import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { StepEnum } from '../tabs/step';
import HeroOption from './heroOption';

export default class DeletableOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    private option: HeroOption,
    readonly settings: { addValues: boolean; rightPadding?: boolean } = { addValues: true },
    private deleteCallback: (params?: any) => any,
    readonly callbackParams?: any,
    readonly returnThis: boolean = false,
  ) {}
  key = '';

  private deleted = false;

  render($parent: JQuery<HTMLElement>): void {
    const $container = $(
      `<div class="flexrow hct-justify-between hct-w-full" ${
        this.callbackParams ? 'id="hct_deletable_' + this.callbackParams + '"' : ''
      }>`,
    );
    const $deleteButton = $(
      `<button class="hct-border-0 hct-bg-inherit hct-grow-0 hover:hct-shadow-none hct-hover-accent ${
        this.settings.rightPadding ? 'hct-pr-sm' : ''
      }"><i class="fas fa-trash"></i></button>`,
    );
    $deleteButton.on('click', () => {
      this.deleted = true;
      this.deleteCallback((this.returnThis ? this : this.callbackParams) || this);
    });
    this.option.render($container);
    $container.append($deleteButton);
    $parent.append($container);
  }
  value() {
    return this.deleted ? undefined : this.option.value();
  }
  isFulfilled(): boolean {
    return this.deleted ? true : this.option.isFulfilled();
  }
  applyToHero(actor: ActorDataConstructorData): void {
    if (!this.deleted) this.option.applyToHero(actor);
  }
}

import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { StepEnum } from '../Step';
import HeroOption from './HeroOption';

export default class DeletableOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    private option: HeroOption,
    readonly settings: { addValues: boolean; rightPadding?: boolean } = { addValues: true },
    private deleteCallback: (params?: any) => any,
    readonly callbackParams?: any,
  ) {}
  key = '';

  private deleted = false;

  render($parent: JQuery<HTMLElement>): void {
    const $container = $(
      `<div class="hct-flex hct-flex-justify-sb hct-width-full" ${
        this.callbackParams ? 'id="hct_deletable_' + this.callbackParams + '"' : ''
      }>`,
    );
    const $deleteButton = $(
      `<button class="hct-no-border hct-no-background hct-width-fit hct-hover-no-shadow hct-hover-accent ${
        this.settings.rightPadding ? 'hct-padding-r-medium' : ''
      }"><i class="fas fa-trash"></i></button>`,
    );
    $deleteButton.on('click', () => {
      this.deleted = true;
      this.deleteCallback(this.callbackParams || this);
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

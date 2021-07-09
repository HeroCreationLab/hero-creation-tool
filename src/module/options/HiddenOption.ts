import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';

/**
 * Represents a value that is given to the created actor but doesn't need user input
 * e.g. the foundry Items that will be added to the Actor, like Race/Class.
 * @class
 */
export default class HiddenOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    readonly opt: any,
    readonly settings: {
      addValues: boolean;
    } = { addValues: false },
  ) {}

  render(parent: JQuery<HTMLElement>): void {
    throw new Error('Hidden hero options should not be rendered');
  }

  value(): any {
    return this.opt;
  }

  isFulfilled(): boolean {
    return !!this.value();
  }

  applyToHero(actor: ActorDataConstructorData): void {
    apply(actor, this.key, this.value(), this.settings.addValues);
  }
}

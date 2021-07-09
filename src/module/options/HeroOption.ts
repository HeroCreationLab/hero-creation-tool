import { StepEnum } from '../Step';
import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import * as Utils from '../utils';

/**
 * Represents an option that will be reflected on the final hero.
 * @interface
 */
export default interface HeroOption {
  render(parent: JQuery): void;
  value(): any;
  isFulfilled(): boolean;
  applyToHero(actor: ActorDataConstructorData): void;
  addValues: boolean;
  key: string;
  origin: StepEnum;
}

export const apply = (existingData: ActorDataConstructorData, key: string, value: any, addValues: boolean) => {
  [key, value] = Utils.getActorDataForProficiency(key, value);
  if (!key || !value) return existingData;

  const dataSnapshot: any = {};
  if (addValues) {
    // find any previous value on existing data
    dataSnapshot[key] = getProperty(existingData, key); //getValueFromInnerProperty(existingData, key);
    if (dataSnapshot[key]) {
      if (Array.isArray(dataSnapshot[key])) {
        value = dataSnapshot[key].concat(...value);
      } else {
        if (!isNaN(value)) {
          value = Number.parseInt(dataSnapshot[key]) + Number.parseInt(value);
        } else {
          console.error('Expected to add value to previous, but value is not a number');
        }
      }
    }
  }
  dataSnapshot[key] = value;
  mergeObject(existingData, dataSnapshot);
};

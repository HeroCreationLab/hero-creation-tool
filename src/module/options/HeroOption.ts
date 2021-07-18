import { StepEnum } from '../Step';
import type { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';

/**
 * Represents an option that will be reflected on the final hero.
 * @interface
 */
export default interface HeroOption {
  render(parent: JQuery): void;
  value(): any;
  isFulfilled(): boolean;
  applyToHero(actor: ActorDataConstructorData): void;
  key: string;
  origin: StepEnum;
  settings: {
    addValues: boolean;
  };
}

export const apply = (
  existingData: ActorDataConstructorData,
  key: string,
  value: any,
  addValues: boolean,
  enforceNumber?: boolean,
) => {
  try {
    [key, value] = getActorDataForProficiency(key, value);
    if (
      !key ||
      !value ||
      key.indexOf('null') > -1 ||
      (!Array.isArray(value) && isNaN(value) && typeof value == 'string' && value.indexOf('null') > -1)
    )
      return existingData;

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
            console.error('Expected to add value to previous, but value is not a number nor array');
          }
        }
      }
    }
    dataSnapshot[key] = enforceNumber ? Number.parseInt(value) : value;
    mergeObject(existingData, dataSnapshot);
  } catch (error) {
    console.warn('Error on HeroOption.apply(..) - printing error and logging variables');
    console.error(error);
    console.warn('existingData: ');
    console.warn(existingData);
    console.warn(`key: [${key}]`);
    console.warn('value: ');
    console.warn(value);
    console.warn(`addValues: [${addValues}]`);
  }
};

function getActorDataForProficiency(key: string, value: any): [key: string, value: any] {
  if (!isProficiencyKey(key)) return [key, value];

  if (Array.isArray(value) && value.length == 1) {
    value = value[0];
  }
  const baseKey = 'data.traits';
  let pair: [string, any];
  if (key === 'skills') {
    pair = [`data.skills.${value}.value`, 1];
  } else {
    if (isCustomKey(key, value)) pair = [`${baseKey}.${key}.custom`, value];
    else pair = [`${baseKey}.${key}.value`, [value]];
  }
  return pair;
}

function isProficiencyKey(key: string): boolean {
  if (key.indexOf('skill') > -1) return true;
  if (key.indexOf('language') > -1) return true;
  if (key.indexOf('weapon') > -1) return true;
  if (key.indexOf('armor') > -1) return true;
  if (key.indexOf('tool') > -1) return true;
  return false;
}

function isCustomKey(key: string, value: string): boolean {
  const dnd5e = (game as any).dnd5e;
  let keyList: any;
  switch (key) {
    case 'weaponProf':
      keyList = Object.keys(dnd5e.config.weaponProficiencies);
      break;
    case 'armorProf':
      keyList = Object.keys(dnd5e.config.armorProficiencies);
      break;
    case 'toolProf':
      keyList = Object.keys(dnd5e.config.toolProficiencies);
      break;
    case 'languages':
      keyList = Object.keys(dnd5e.config.languages);
      break;
  }
  for (const key in keyList) {
    if (keyList[key] === value) return false;
  }
  return true;
}

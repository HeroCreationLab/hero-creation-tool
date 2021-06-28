import { Condition } from './Condition';
import { DamageType } from './DamageType';
import { Language } from './Language';
import { Size } from './Size';
import { Skill } from './Skill';
import { WeaponType } from './WeaponType';
import { ArmorType } from './ArmorType';
import { Tool } from './Tool';
import { CreatureType } from './CreatureType';

export default class Race {
  name: string;
  parentRace?: Race;

  abilityScoreImprovements: {
    Str?: number;
    Dex?: number;
    Con?: number;
    Int?: number;
    Wis?: number;
    Cha?: number;
    any?: number[];
  } = {};

  type?: CreatureType = CreatureType.Humanoid;
  size?: Size;
  hp?: { bonus: number };
  senses?: { darkvision?: number };
  movement?: Movement;
  languages?: Choosable<Language>;

  proficiencies: {
    skills?: Choosable<Skill>;
    weapons?: Choosable<WeaponType>;
    armor?: Choosable<ArmorType>;
    tools?: Choosable<Tool>;
  } = {};

  damage: {
    immunities?: Choosable<DamageType>;
    resistances?: Choosable<DamageType>;
    vulnerabilities?: Choosable<DamageType>;
  } = {};

  condition: {
    immunities?: Choosable<Condition>;
    advantage?: Choosable<Condition>;
  } = {};

  constructor(raceName: string, parentRace?: Race) {
    this.name = raceName;
    this.parentRace = parentRace;
  }
}

export function getItemNames(race: Race) {
  return race.parentRace ? [race.parentRace.name, race.name] : [race.name];
}

export interface Choosable<T> {
  fixed?: {
    value?: T[];
    custom?: string[];
  };
  any?: number;
  choose?: ChoosableChoice<T>;
}

export interface ChoosableChoice<T> {
  quantity: number;
  options: {
    value?: T[];
    custom?: string[];
  };
}

export interface Movement {
  walk?: number;
  burrow?: number;
  climb?: number;
  fly?: number;
  swim?: number;
  hover?: boolean;
}

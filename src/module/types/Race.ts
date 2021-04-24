import { Condition } from './Condition';
import { DamageType } from './DamageType';
import { Language } from './Language';
import { Size } from './Size';
import { Skill } from './Skill';
import { WeaponType } from './WeaponType';
import { ArmorType } from './ArmorType';
import { Tool } from './Tool';
import * as Utils from '../utils';
import { CreatureType } from './CreatureType';

export default class Race {
  name: string;
  item: any = null;
  parentRace?: Race;

  abilityScoreImprovements: {
    Str?: { bonus: number };
    Dex?: { bonus: number };
    Con?: { bonus: number };
    Int?: { bonus: number };
    Wis?: { bonus: number };
    Cha?: { bonus: number };
    any?: { bonus: number[] };
  } = {};

  type?: CreatureType = CreatureType.Humanoid;
  size?: Size = Size.Medium;
  hp?: { bonus: number };
  darkvision?: number;

  movement?: Movement = { walk: 30 };

  languages?: Choosable<Language> = { fixed: [Language.Common] };

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

  constructor(raceName: string, compendium: Entity<Entity.Data>[], subraceOf?: Race) {
    this.name = raceName;
    this.parentRace = subraceOf;
    this.item = Utils.getItemFromCompendiumByName(compendium, raceName);
  }
}

export declare interface Choosable<T> {
  fixed?: T[] | string[];
  any?: number;
  choose?: {
    quantity: number;
    options: T[] | string[];
  };
}

export declare interface Movement {
  walk?: number;
  burrow?: number;
  climb?: number;
  fly?: number;
  swim?: number;
  hover?: boolean;
}

import * as Constants from './constants';
import Race from './types/Race';
import { DamageType } from './types/DamageType';
import { Size } from './types/Size';
import { Condition } from './types/Condition';
import { Skill } from './types/Skill';
import { Language } from './types/Language';

export async function setupRaces(): Promise<Race[]> {
  console.log(`${Constants.LOG_PREFIX} | Building races`);

  const races: Race[] = [];

  const dragonborn: Race = {
    ...new Race('Dragonborn'),
    abilityScoreImprovements: {
      Str: 2,
      Cha: 1,
    },
    size: Size.Medium,
    movement: { walk: 30 },
    languages: {
      fixed: {
        value: [Language.Common, Language.Draconic],
      },
    },
  };
  races.push(dragonborn);

  const dwarf: Race = {
    ...new Race('Dwarf'),
    abilityScoreImprovements: { Con: 2 },
    size: Size.Medium,
    movement: { walk: 25 },
    senses: { darkvision: 60 },
    damage: {
      resistances: { fixed: { value: [DamageType.poison] } },
    },
    languages: { fixed: { value: [Language.Common, Language.Dwarvish] } },
    proficiencies: {
      weapons: { fixed: { custom: ['battleaxe', 'handaxe', 'light hammer', 'warhammer'] } },
      tools: {
        choose: {
          quantity: 1,
          options: { custom: ["smith's tools", "brewer's supplies", "mason's tools"] },
        },
      },
    },
  };
  races.push(dwarf);

  const hillDwarf: Race = mergeObject(
    dwarf,
    {
      ...new Race('Hill Dwarf', dwarf),
      abilityScoreImprovements: { Wis: 1 },
      hp: { bonus: 1 },
    },
    Constants.MERGE_OPTIONS,
  );
  races.push(hillDwarf);

  const elf: Race = {
    ...new Race('Elf'),
    abilityScoreImprovements: { Dex: 2 },
    size: Size.Medium,
    senses: { darkvision: 60 },
    movement: { walk: 30 },
    languages: { fixed: { value: [Language.Common, Language.Elvish] } },
    proficiencies: { skills: { fixed: { value: [Skill.Perception] } } },
    condition: { advantage: { fixed: { value: [Condition.charmed] } } },
  };
  races.push(elf);

  const highElf: Race = mergeObject(
    elf,
    {
      ...new Race('High Elf', elf),
      abilityScoreImprovements: { Int: 1 },
      languages: { any: 1 },
      proficiencies: { weapons: { fixed: { custom: ['longsword', 'shortsword', 'shortbow', 'longbow'] } } },
    },
    Constants.MERGE_OPTIONS,
  );
  races.push(highElf);

  const gnome: Race = {
    ...new Race('Gnome'),
    abilityScoreImprovements: { Int: 2 },
    size: Size.Small,
    senses: { darkvision: 60 },
    movement: { walk: 25 },
    languages: { fixed: { value: [Language.Common, Language.Gnomish] } },
  };
  races.push(gnome);

  const rockGnome: Race = mergeObject(
    gnome,
    {
      ...new Race('Rock Gnome', gnome),
      abilityScoreImprovements: { Con: 1 },
      proficiencies: { tools: { fixed: { custom: ["tinker's tools"] } } },
    },
    Constants.MERGE_OPTIONS,
  );
  races.push(rockGnome);

  const halfElf: Race = {
    ...new Race('Half-Elf'),
    abilityScoreImprovements: {
      Cha: 2,
      any: [1, 1],
    },
    size: Size.Medium,
    senses: { darkvision: 60 },
    movement: { walk: 30 },
    condition: { advantage: { fixed: { value: [Condition.charmed] } } },
    languages: {
      fixed: { value: [Language.Common, Language.Elvish] },
      any: 1,
    },
    proficiencies: { skills: { any: 2 } },
  };
  races.push(halfElf);

  const halfOrc: Race = {
    ...new Race('Half-Orc'),
    abilityScoreImprovements: {
      Str: 2,
      Con: 1,
    },
    size: Size.Medium,
    senses: { darkvision: 60 },
    movement: { walk: 30 },
    languages: { fixed: { value: [Language.Common, Language.Orc] } },
    proficiencies: { skills: { fixed: { value: [Skill.Intimidation] } } },
  };
  races.push(halfOrc);

  const halfling: Race = {
    ...new Race('Halfling'),
    abilityScoreImprovements: { Dex: 2 },
    size: Size.Small,
    movement: { walk: 25 },
    condition: { advantage: { fixed: { value: [Condition.charmed] } } },
    languages: { fixed: { value: [Language.Common, Language.Halfling] } },
  };
  races.push(halfling);

  const lightfootHalfling: Race = mergeObject(
    halfling,
    {
      ...new Race('Lightfoot Halfling', halfling),
      abilityScoreImprovements: { Cha: 1 },
    },
    Constants.MERGE_OPTIONS,
  );
  races.push(lightfootHalfling);

  const human: Race = {
    ...new Race('Human'),
    abilityScoreImprovements: {
      Str: 1,
      Dex: 1,
      Con: 1,
      Int: 1,
      Wis: 1,
      Cha: 1,
    },
    size: Size.Medium,
    movement: { walk: 30 },
    languages: {
      fixed: { value: [Language.Common] },
      any: 1,
    },
  };
  races.push(human);

  const tiefling: Race = {
    ...new Race('Tiefling'),
    abilityScoreImprovements: {
      Int: 1,
      Cha: 2,
    },
    size: Size.Medium,
    senses: { darkvision: 60 },
    movement: { walk: 30 },
    damage: { resistances: { fixed: { value: [DamageType.fire] } } },
    languages: { fixed: { value: [Language.Common, Language.Infernal] } },
  };
  races.push(tiefling);

  return races;
}

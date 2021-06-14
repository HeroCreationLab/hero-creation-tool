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
    languages: { fixed: [Language.Common, Language.Draconic] },
  };
  races.push(dragonborn);

  const dwarf: Race = {
    ...new Race('Dwarf'),
    abilityScoreImprovements: { Con: 2 },
    size: Size.Medium,
    movement: { walk: 25 },
    senses: { darkvision: 60 },
    damage: { resistances: { fixed: [DamageType.poison] } },
    languages: { fixed: [Language.Common, Language.Dwarvish] },
    proficiencies: {
      weapons: { fixed: ['battleaxe', 'handaxe', 'light hammer', 'warhammer'] },
      tools: {
        choose: {
          quantity: 1,
          options: ["smith's tools", "brewer's supplies", "mason's tools"],
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

  // FIXME TEST
  const pepeDwarf: Race = mergeObject(
    dwarf,
    {
      ...new Race('Pepe Dwarf', dwarf),
      abilityScoreImprovements: { Int: 1 },
      proficiencies: {
        skills: { fixed: [Skill.Perception] },
        armor: {
          any: 1,
        },
        weapons: {
          choose: {
            quantity: 1,
            options: ['longsword', 'shortsword', 'shortbow', 'longbow'],
          },
        },
        tools: {
          choose: {
            quantity: 2,
            options: ["smith's tools", "brewer's supplies", "mason's tools"],
          },
        },
      },
    },
    Constants.MERGE_OPTIONS,
  );
  races.push(pepeDwarf);
  // END TEST

  const elf: Race = {
    ...new Race('Elf'),
    abilityScoreImprovements: { Dex: 2 },
    size: Size.Medium,
    senses: { darkvision: 60 },
    movement: { walk: 30 },
    languages: { fixed: [Language.Common, Language.Elvish] },
    proficiencies: { skills: { fixed: [Skill.Perception] } },
    condition: { advantage: { fixed: [Condition.charmed] } },
  };
  races.push(elf);

  const highElf: Race = mergeObject(
    elf,
    {
      ...new Race('High Elf', elf),
      abilityScoreImprovements: { Int: 1 },
      languages: { any: 1 },
      proficiencies: { weapons: { fixed: ['longsword', 'shortsword', 'shortbow', 'longbow'] } },
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
    languages: { fixed: [Language.Common, Language.Gnomish] },
  };
  races.push(gnome);

  const rockGnome: Race = mergeObject(
    gnome,
    {
      ...new Race('Rock Gnome', gnome),
      abilityScoreImprovements: { Con: 1 },
      proficiencies: { tools: { fixed: ["tinker's tools"] } },
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
    condition: { advantage: { fixed: [Condition.charmed] } },
    languages: {
      fixed: [Language.Common, Language.Elvish],
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
    languages: { fixed: [Language.Common, Language.Orc] },
    proficiencies: { skills: { fixed: [Skill.Intimidation] } },
  };
  races.push(halfOrc);

  const halfling: Race = {
    ...new Race('Halfling'),
    abilityScoreImprovements: { Dex: 2 },
    size: Size.Small,
    movement: { walk: 25 },
    condition: { advantage: { fixed: [Condition.charmed] } },
    languages: { fixed: [Language.Common, Language.Halfling] },
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
      fixed: [Language.Common],
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
    damage: { resistances: { fixed: [DamageType.fire] } },
    languages: { fixed: [Language.Common, Language.Infernal] },
  };
  races.push(tiefling);

  return races;
}

export async function setupClasses(): Promise<any[]> {
  console.log(`${Constants.LOG_PREFIX} | Building classes`);
  const compClasses = await game.packs.get('dnd5e.classes').getDocuments();
  const compClassFeatures = await game.packs.get('dnd5e.classfeatures').getDocuments();
  console.log(compClasses + compClassFeatures); // TODO remove this when implemented, its only to stop Typescript from complaining about unused vars
  return [];
}

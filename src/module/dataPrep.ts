import * as Constants from './constants';
import Race from './types/Race';
import { DamageType } from './types/DamageType';
import { Size } from './types/Size';
import { Condition } from './types/Condition';
import { Skill } from './types/Skill';
import { Language } from './types/Language';

declare let game: { packs: any };

export function returnLanguages(): Language[] {
  return [Language.Common, Language.Draconic, Language.Elvish];
}
export async function setupRacesTest(): Promise<Race[]> {
  const raceCompendium = await game.packs.get('dnd5e.races').getDocuments();
  const races: Race[] = [];

  const elf: Race = {
    ...new Race('Elf', raceCompendium),
    abilityScoreImprovements: { Dex: { bonus: 2 } },
    darkvision: 60,
    languages: { fixed: [Language.Common, Language.Elvish] },
    proficiencies: { skills: { fixed: [Skill.Perception] } },
    condition: { advantage: { fixed: [Condition.charmed] } },
  };
  races.push(elf);

  const highElf: Race = {
    ...new Race('High Elf', raceCompendium, elf),
    abilityScoreImprovements: { Int: { bonus: 1 } },
    languages: { any: 1 },
    proficiencies: { weapons: { fixed: ['longsword', 'shortsword', 'shortbow', 'longbow'] } },
  };
  races.push(highElf);

  // FIXME delete this after testing
  const fakeElf: Race = {
    ...new Race('Fake Elf', raceCompendium, elf),
    abilityScoreImprovements: { Int: { bonus: 1 } },
    size: Size.Small,
    languages: { any: 1, fixed: [Language.Draconic] },
    proficiencies: { weapons: { fixed: ['longsword', 'shortsword', 'shortbow', 'longbow'] } },
  };
  races.push(fakeElf);

  return races;
}

export async function setupRaces(): Promise<Race[]> {
  console.log(`${Constants.LOG_PREFIX} | Building races`);
  const raceCompendium = await game.packs.get('dnd5e.races').getDocuments();
  const races: Race[] = [];

  const dragonborn: Race = {
    ...new Race('Dragonborn', raceCompendium),
    abilityScoreImprovements: {
      Str: { bonus: 2 },
      Cha: { bonus: 1 },
    },
    languages: { fixed: [Language.Common, Language.Draconic] },
  };
  races.push(dragonborn);

  const dwarf: Race = {
    ...new Race('Dwarf', raceCompendium),
    abilityScoreImprovements: { Con: { bonus: 2 } },
    movement: { walk: 25 },
    darkvision: 60,
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

  const hillDwarf: Race = {
    ...new Race('Hill Dwarf', raceCompendium, dwarf),
    abilityScoreImprovements: { Wis: { bonus: 1 } },
    movement: {}, //clear default 30ft to take the parent's
    size: Size.Medium,
    hp: { bonus: 1 },
  };
  races.push(hillDwarf);

  const elf: Race = {
    ...new Race('Elf', raceCompendium),
    abilityScoreImprovements: { Dex: { bonus: 2 } },
    darkvision: 60,
    languages: { fixed: [Language.Common, Language.Elvish] },
    proficiencies: { skills: { fixed: [Skill.Perception] } },
    condition: { advantage: { fixed: [Condition.charmed] } },
  };
  races.push(elf);

  const highElf: Race = {
    ...new Race('High Elf', raceCompendium, elf),
    abilityScoreImprovements: { Int: { bonus: 1 } },
    languages: { any: 1 },
    proficiencies: { weapons: { fixed: ['longsword', 'shortsword', 'shortbow', 'longbow'] } },
  };
  races.push(highElf);

  // FIXME delete this after testing
  const fakeElf: Race = {
    ...new Race('Fake Elf', raceCompendium, elf),
    abilityScoreImprovements: { Int: { bonus: 1 } },
    size: Size.Small,
    languages: { any: 1, fixed: [Language.Draconic] },
    proficiencies: { weapons: { fixed: ['longsword', 'shortsword', 'shortbow', 'longbow'] } },
  };
  races.push(fakeElf);

  const gnome: Race = {
    ...new Race('Gnome', raceCompendium),
    abilityScoreImprovements: { Int: { bonus: 2 } },
    size: Size.Small,
    darkvision: 60,
    movement: { walk: 25 },
    languages: { fixed: [Language.Common, Language.Gnomish] },
  };
  races.push(gnome);

  const rockGnome: Race = {
    ...new Race('Rock Gnome', raceCompendium, gnome),
    abilityScoreImprovements: { Con: { bonus: 1 } },
    proficiencies: { tools: { fixed: ["tinker's tools"] } },
    size: undefined,
    languages: undefined,
  };
  races.push(rockGnome);

  const halfElf: Race = {
    ...new Race('Half-Elf', raceCompendium),
    abilityScoreImprovements: {
      Cha: { bonus: 2 },
      any: { bonus: [1, 1] },
    },
    darkvision: 60,
    condition: { advantage: { fixed: [Condition.charmed] } },
    languages: {
      fixed: [Language.Common, Language.Elvish],
      any: 1,
    },
    proficiencies: { skills: { any: 2 } },
  };
  races.push(halfElf);

  const halfOrc: Race = {
    ...new Race('Half-Orc', raceCompendium),
    abilityScoreImprovements: {
      Str: { bonus: 2 },
      Con: { bonus: 1 },
    },
    darkvision: 60,
    languages: { fixed: [Language.Common, Language.Orc] },
    proficiencies: { skills: { fixed: [Skill.Intimidation] } },
  };
  races.push(halfOrc);

  const halfling: Race = {
    ...new Race('Halfling', raceCompendium),
    abilityScoreImprovements: { Dex: { bonus: 2 } },
    size: Size.Small,
    movement: { walk: 25 },
    condition: { advantage: { fixed: [Condition.charmed] } },
    languages: { fixed: [Language.Common, Language.Halfling] },
  };
  races.push(halfling);

  const lightfootHalfling: Race = {
    ...new Race('Lightfoot Halfling', raceCompendium, halfling),
    abilityScoreImprovements: { Cha: { bonus: 1 } },
    size: undefined,
    languages: undefined,
  };
  races.push(lightfootHalfling);

  const human: Race = {
    ...new Race('Human', raceCompendium),
    abilityScoreImprovements: {
      Str: { bonus: 1 },
      Dex: { bonus: 1 },
      Con: { bonus: 1 },
      Int: { bonus: 1 },
      Wis: { bonus: 1 },
      Cha: { bonus: 1 },
    },
    languages: {
      fixed: [Language.Common],
      any: 1,
    },
  };
  races.push(human);

  const tiefling: Race = {
    ...new Race('Tiefling', raceCompendium),
    abilityScoreImprovements: {
      Int: { bonus: 1 },
      Cha: { bonus: 2 },
    },
    darkvision: 60,
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
  console.log(compClassFeatures);
  console.log(compClasses);
  return [];
}

import { Constants } from './constants.js'
import { DamageType } from './types/DamageType.js'
import Race from './types/Race.js'
import { Size } from './types/Size.js'
import { Condition } from './types/Condition.js'
import { Skill } from './types/Skill.js'
import { Language } from './types/Language.js'

declare let game: { packs: any }

export namespace DataPrep {
    export async function setupRaces(): Promise<Race[]> {
        console.log(`${Constants.LOG_PREFIX} | Building races`);
        const raceCompendium = await game.packs.get('dnd5e.races').getDocuments();
        const races: Race[] = [];

        const dragonborn: Race = {
            ...new Race('Dragonborn', null, raceCompendium),
            abilityScoreImprovements: {
                Str: { bonus: 2 },
                Cha: { bonus: 1 }
            },
            proficiencies: {
                languages: { fixed: [Language.common, Language.draconic] }
            }
        }
        races.push(dragonborn);

        const dwarf: Race = {
            ...new Race('Dwarf', null, raceCompendium),
            abilityScoreImprovements: { Con: { bonus: 2 } },
            movement: { walk: 25 },
            darkvision: 60,
            damage: { resistances: { fixed: [DamageType.poison] } },
            proficiencies: {
                languages: { fixed: [Language.common, Language.dwarvish] },
                weapons: { choose: ['battleaxe', 'handaxe', 'light hammer', 'warhammer'] },
                tools: {
                    choose: {
                        quantity: 1,
                        options: ["smith's tools", "brewer's supplies", "mason's tools"],
                    }
                }
            },
        }
        races.push(dwarf);

        const hillDwarf: Race = {
            ...new Race('Hill Dwarf', dwarf, raceCompendium),
            abilityScoreImprovements: { Wis: { bonus: 1 } },
            movement: {}, //clear default 30ft to take the parent's
            size: Size.Medium,
            hp: { bonus: 1 }
        }
        races.push(hillDwarf);

        const elf: Race = {
            ...new Race('Elf', null, raceCompendium),
            abilityScoreImprovements: { Dex: { bonus: 2 } },
            darkvision: 60,
            proficiencies: {
                skills: { fixed: [Skill.Perception] },
                languages: { fixed: [Language.common, Language.elvish] },
            },
            condition: { advantage: { fixed: [Condition.charmed] } },
        }
        races.push(elf);

        const highElf: Race = {
            ...new Race('High Elf', elf, raceCompendium),
            abilityScoreImprovements: { Int: { bonus: 1 } },
            proficiencies: {
                weapons: { fixed: ['longsword', 'shortsword', 'shortbow', 'longbow'] },
                languages: { any: 1 }
            }
        }
        races.push(highElf);

        // FIXME delete this after testing
        const fakeElf: Race = {
            ...new Race('Fake Elf', elf, raceCompendium),
            abilityScoreImprovements: { Int: { bonus: 1 } },
            size: Size.Small,
            proficiencies: {
                weapons: { fixed: ['longsword', 'shortsword', 'shortbow', 'longbow'] },
                languages: { any: 1 }
            }
        }
        races.push(fakeElf);

        const gnome: Race = {
            ...new Race('Gnome', null, raceCompendium),
            abilityScoreImprovements: { Int: { bonus: 2 } },
            size: Size.Small,
            darkvision: 60,
            movement: { walk: 25 },
            proficiencies: { languages: { fixed: [Language.common, Language.gnomish] } }
        }
        races.push(gnome);

        const rockGnome: Race = {
            ...new Race('Rock Gnome', gnome, raceCompendium),
            abilityScoreImprovements: { Con: { bonus: 1 } },
            size: null,
            movement: null,
            proficiencies: { tools: { fixed: ["tinker's tools"] } }
        }
        races.push(rockGnome);

        const halfElf: Race = {
            ...new Race('Half-Elf', null, raceCompendium),
            abilityScoreImprovements: {
                Cha: { bonus: 2 },
                any: { bonus: [1, 1] }
            },
            darkvision: 60,
            condition: { advantage: { fixed: [Condition.charmed] } },
            proficiencies: {
                skills: { any: 2 },
                languages: {
                    fixed: [Language.common, Language.elvish],
                    any: 1
                }
            }
        }
        races.push(halfElf);

        const halfOrc: Race = {
            ...new Race('Half-Orc', null, raceCompendium),
            abilityScoreImprovements: {
                Str: { bonus: 2 },
                Con: { bonus: 1 }
            },
            darkvision: 60,
            proficiencies: {
                skills: { fixed: [Skill.Intimidation] },
                languages: { fixed: [Language.common, Language.orc] }
            }
        }
        races.push(halfOrc);

        const halfling: Race = {
            ...new Race('Halfling', null, raceCompendium),
            abilityScoreImprovements: { Dex: { bonus: 2 } },
            size: Size.Small,
            movement: { walk: 25 },
            condition: { advantage: { fixed: [Condition.charmed] } },
            proficiencies: { languages: { fixed: [Language.common, Language.halfling] } },
        }
        races.push(halfling);

        const lightfootHalfling: Race = {
            ...new Race('Lightfoot Halfling', halfling, raceCompendium),
            abilityScoreImprovements: { Cha: { bonus: 1 } },
            size: null,
            movement: null,
        }
        races.push(lightfootHalfling);

        const human: Race = {
            ...new Race('Human', null, raceCompendium),
            abilityScoreImprovements: {
                Str: { bonus: 1 },
                Dex: { bonus: 1 },
                Con: { bonus: 1 },
                Int: { bonus: 1 },
                Wis: { bonus: 1 },
                Cha: { bonus: 1 },
            },
            proficiencies: {
                languages: {
                    fixed: [Language.common],
                    any: 1
                }
            }
        }
        races.push(human);

        const tiefling: Race = {
            ...new Race('Tiefling', null, raceCompendium),
            abilityScoreImprovements: {
                Int: { bonus: 1 },
                Cha: { bonus: 2 },
            },
            darkvision: 60,
            damage: { resistances: { fixed: [DamageType.fire] } },
            proficiencies: { languages: { fixed: [Language.common, Language.infernal] } }
        }
        races.push(tiefling);

        return races;
    }

    export async function setupClasses(): Promise<any[]> {
        console.log(`${Constants.LOG_PREFIX} | Building classes`);
        const compClasses = await game.packs.get('dnd5e.classes').getDocuments();
        const compClassFeatures = await game.packs.get('dnd5e.classfeatures').getDocuments();

        return [];
    }
}

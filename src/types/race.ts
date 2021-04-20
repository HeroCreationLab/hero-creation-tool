import { Condition } from './Condition.js'
import { DamageType } from './DamageType.js'
import { Language } from './Language.js'
import { Size } from './Size.js'
import { Skill } from './Skill.js'
import { WeaponType } from './WeaponType.js'
import { ArmorType } from './ArmorType.js'
import { Tool } from './Tool.js'
import { Utils } from '../utils.js'
import { CreatureType } from './CreatureType.js'

export default class Race {
    name: string;
    item: any = null;
    parentRace?: Race;

    abilityScoreImprovements: {
        Str?: { bonus: number },
        Dex?: { bonus: number },
        Con?: { bonus: number },
        Int?: { bonus: number },
        Wis?: { bonus: number },
        Cha?: { bonus: number },
        any?: { bonus: number[] }
    } = {};

    type?: CreatureType = CreatureType.Humanoid;
    size?: Size = Size.Medium;
    hp?: { bonus: number }
    darkvision: number = 0;

    movement: {
        walk?: number,
        burrow?: number,
        climb?: number,
        fly?: number,
        swim?: number,
        hover?: boolean
    } = { walk: 30 };

    proficiencies: {
        skills?: {
            fixed?: Skill[], // any proficiencies that the race always has
            any?: number, // any number of free skill proficiencies (e.g. pick any three skills..)
            choose?: { // number and options when you can pick some number of skills between a subset
                quantity: number,
                options: Skill[]
            }
        },
        weapons?: {
            fixed?: WeaponType[] | string[],
            any?: number,
            choose?: string[] // free input
        },
        armor?: {
            fixed?: ArmorType[] | string[],
            any?: number,
            choose?: string[]
        },
        languages?: {
            fixed?: Language[],
            any?: number,
            choose?: {
                quantity: number,
                options: Language[]
            }
        },
        tools?: {
            fixed?: Tool[] | string[],
            any?: number,
            choose?: {
                quantity: number,
                options: Tool[] | string[]
            }
        }
    } = { languages: { fixed: [Language.common] } }

    damage: {
        immunities?: {
            fixed?: DamageType[],
            any?: number,
            choose?: {
                quantity: number,
                options: DamageType[]
            }
        },
        resistances?: {
            fixed?: DamageType[],
            any?: number,
            choose?: {
                quantity: number,
                options: DamageType[]
            }
        },
        vulnerabilities?: {
            fixed?: DamageType[],
            any?: number,
            choose?: {
                quantity: number,
                options: DamageType[]
            }
        }
    } = {}

    condition: {
        immunities?: {
            fixed?: Condition[],
            any?: number,
            choose?: {
                quantity: number,
                options: Condition[]
            }
        },
        advantage?: {
            fixed?: Condition[],
            any?: number,
            choose?: {
                quantity: number,
                options: Condition[]
            }
        }
    } = {}

    constructor(raceName: string, subraceOf: Race, compendium: Entity<Entity.Data>[]) {
        this.name = raceName;
        this.parentRace = subraceOf;
        this.item = Utils.getItemFromCompendiumByName(compendium, raceName);
    }
}

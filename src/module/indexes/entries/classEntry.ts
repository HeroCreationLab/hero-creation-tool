import { IndexEntry } from './indexEntry';
import { HitPointsAdvancementEntry, ItemGrantAdvancementEntry, ScaleValueAdvancementEntry } from './advancementEntry';

export type ClassEntry = IndexEntry & {
  type: 'class';
  system: {
    advancement: (HitPointsAdvancementEntry | ItemGrantAdvancementEntry | ScaleValueAdvancementEntry)[];
    description: { value: string };
    identifier: string;
    hitDice: string;
    saves: string[];
    levels: number;
    skills: {
      number: number;
      choices: string[];
      value: string[];
    };
    spellcasting: {
      ability: string;
      progression: string;
    };
  };
};

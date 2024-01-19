import { AbilityScoreAdvancementEntry, ItemGrantAdvancementEntry, SizeAdvancementEntry } from './advancementEntry';
import { IndexEntry } from './indexEntry';

export type RaceEntry = IndexEntry & {
  type: 'race';
  system: {
    advancement: (AbilityScoreAdvancementEntry | SizeAdvancementEntry | ItemGrantAdvancementEntry)[];
    requirements: string;
    description: { value: string };
  };
};

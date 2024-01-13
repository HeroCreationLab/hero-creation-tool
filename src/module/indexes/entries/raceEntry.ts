import { AbilityScoreAdvancementEntry, ItemGrantAdvancementEntry } from './advancementEntry';
import { IndexEntry } from './indexEntry';

export type RaceEntry = IndexEntry & {
  type: 'race';
  system: {
    advancement: (ItemGrantAdvancementEntry | AbilityScoreAdvancementEntry)[];
    requirements: string;
    description: { value: string };
  };
};

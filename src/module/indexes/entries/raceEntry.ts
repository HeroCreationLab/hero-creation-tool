import { ItemGrantAdvancementEntry } from './advancementEntry';
import { IndexEntry } from './indexEntry';

export type RaceEntry = IndexEntry & {
  system: {
    advancement: ItemGrantAdvancementEntry[];
    requirements: string;
    description: { value: string };
  };
};

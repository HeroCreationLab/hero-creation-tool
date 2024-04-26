import {
  AbilityScoreAdvancementEntry,
  ItemGrantAdvancementEntry,
  SizeAdvancementEntry,
  TraitAdvancementEntry,
} from './advancementEntry';
import { IndexEntry } from './indexEntry';

export type RaceEntry = IndexEntry & {
  type: 'race';
  system: {
    advancement: (
      | AbilityScoreAdvancementEntry
      | SizeAdvancementEntry
      | TraitAdvancementEntry<string>
      | ItemGrantAdvancementEntry
    )[];
    requirements: string;
    description: { value: string };
  };
};

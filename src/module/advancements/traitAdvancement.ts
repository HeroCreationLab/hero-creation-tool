import { TraitAdvancementEntry } from '../indexes/entries/advancementEntry';

export interface TraitAdvancement extends TraitAdvancementEntry {
  value: {
    chosen: Set<string>;
  };
}

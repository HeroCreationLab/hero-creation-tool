import { DND5E } from '../system.utils';
import { SizeAdvancementEntry } from '../indexes/entries/advancementEntry';

export interface SizeAdvancement extends SizeAdvancementEntry {
  value: {
    size: keyof typeof DND5E.SIZES;
  };
}

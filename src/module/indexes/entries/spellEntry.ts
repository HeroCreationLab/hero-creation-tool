import { IndexEntry } from './indexEntry';

export type SpellEntry = IndexEntry & {
  system: {
    level: number;
  };
};

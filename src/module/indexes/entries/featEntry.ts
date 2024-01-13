import { IndexEntry } from './indexEntry';

export type FeatEntry = IndexEntry & {
  system: { requirements: string };
};

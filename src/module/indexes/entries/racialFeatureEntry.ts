import { IndexEntry } from './indexEntry';

export type RacialFeatureEntry = IndexEntry & {
  system: { requirements: string };
};

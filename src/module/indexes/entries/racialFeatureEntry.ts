import { IndexEntry } from './indexEntry';

export type RacialFeatureEntry = IndexEntry & {
  type: 'feat';
  system: {
    type: { value: 'race' };
    requirements: string;
  };
};

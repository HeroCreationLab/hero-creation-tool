import { IndexEntry } from './indexEntry';

export type ClassFeatureEntry = IndexEntry & {
  system: {
    description: { value: string };
    requirements: string;
  };
  _advancement: {
    id: string;
    uuid: string;
    lv?: number;
  };
};

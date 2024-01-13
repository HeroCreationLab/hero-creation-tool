import { IndexEntry } from './indexEntry';
import { ItemGrantAdvancementEntry, ScaleValueAdvancementEntry } from './advancementEntry';

export type SubclassEntry = IndexEntry & {
  system: {
    advancement: (ItemGrantAdvancementEntry | ScaleValueAdvancementEntry)[];
    description: { value: string };
    identifier: string;
    classIdentifier: string;
    spellcasting: {
      ability: string;
      progression: string;
    };
  };
};

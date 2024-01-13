import { Sources, SourceType } from '../settings';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';
import { EntryHitPointsAdvancement, EntryItemGrantAdvancement, EntryScaleValueAdvancement } from './indexUtils';

export type ClassEntry = IndexEntry & {
  system: {
    advancement: (EntryHitPointsAdvancement | EntryItemGrantAdvancement | EntryScaleValueAdvancement)[];
    description: { value: string };
    identifier: string;
    hitDice: string;
    saves: string[];
    levels: number;
    skills: {
      number: number;
      choices: string[];
      value: string[];
    };
    spellcasting: {
      ability: string;
      progression: string;
    };
  };
};

export function addClassFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.CLASSES].includes(packName)) {
    fieldsToIndex.add('system.advancement');
    fieldsToIndex.add('system.description.value'); // for sidebar
    fieldsToIndex.add('system.identifier');
    fieldsToIndex.add('system.hitDice');
    fieldsToIndex.add('system.saves');
    fieldsToIndex.add('system.skills');
    fieldsToIndex.add('system.spellcasting');
  }
}

export async function getClassEntries() {
  const classEntries = await (getIndexEntriesForSource(SourceType.CLASSES) as unknown as Promise<ClassEntry[]>);
  // sanitize entries to remove anything nonconforming to a Class
  return classEntries.filter((c) => c.type == 'class');
}

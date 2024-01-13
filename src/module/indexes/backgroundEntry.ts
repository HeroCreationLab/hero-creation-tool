import { SourceType, Sources } from '../settings';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';

export type BackgroundEntry = IndexEntry & unknown;

export async function getBackgroundEntries() {
  const backgroundEntries = await (getIndexEntriesForSource(SourceType.BACKGROUNDS) as unknown as Promise<
    BackgroundEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Background Features become a type in the future)
  return backgroundEntries.filter((f) => f.type == 'background');
}

export function addBackgroundFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.BACKGROUNDS].includes(packName)) {
    fieldsToIndex.add('name');
  }
}

import { Sources, SourceType } from '../settings';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';

export type FeatEntry = IndexEntry & {
  system: { requirements: string };
};

export function addFeatFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.FEATS].includes(packName)) {
    fieldsToIndex.add('system.requirements'); // TODO if feat has a requirement show it.
  }
}

export async function getFeatEntries() {
  const featEntries = await (getIndexEntriesForSource(SourceType.FEATS) as unknown as Promise<FeatEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Feats become a type in the future)
  return featEntries.filter((f) => f.type == 'feat');
}

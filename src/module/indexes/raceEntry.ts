import { Sources, SourceType } from '../settings';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';

export type RaceEntry = IndexEntry & {
  system: {
    requirements: string;
    description: { value: string };
  };
};

export function addRaceFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.RACES].includes(packName)) {
    fieldsToIndex.add('system.requirements'); // for figuring subraces
    fieldsToIndex.add('system.description.value'); // for sidebar
  }
}

export async function getRaceEntries() {
  const raceEntries = await (getIndexEntriesForSource(SourceType.RACES) as unknown as Promise<RaceEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now, until Race becomes a type)
  return raceEntries.filter((r) => r.type == 'feat');
}

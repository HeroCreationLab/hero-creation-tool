import { Sources, SourceType } from '../settings';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';

export type RacialFeatureEntry = IndexEntry & {
  system: { requirements: string };
};

export function addRacialFeaturesFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.RACIAL_FEATURES].includes(packName)) {
    fieldsToIndex.add('system.requirements'); // for mapping racial features to races/subraces
  }
}

export async function getRaceFeatureEntries() {
  const raceFeatureEntries = await (getIndexEntriesForSource(SourceType.RACIAL_FEATURES) as unknown as Promise<
    RacialFeatureEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Race Features become a type in the future)
  return raceFeatureEntries.filter((f) => f.type == 'feat' && f?.system?.requirements !== '');
}

import { Sources, SourceType } from '../settings';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';

export type SpellEntry = IndexEntry & {
  system: {
    level: number;
  };
};

export function addSpellFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.SPELLS].includes(packName)) {
    fieldsToIndex.add('system.level');
  }
}

export async function getSpellEntries() {
  const spellEntries = await (getIndexEntriesForSource(SourceType.SPELLS) as unknown as Promise<SpellEntry[]>);
  // sanitize entries to remove anything nonconforming to a Spell
  return spellEntries.filter((s) => s.type == 'spell');
}

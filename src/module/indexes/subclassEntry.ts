import SettingKeys, { SourceType, Sources } from '../settings';
import { getModuleSetting } from '../utils';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';
import { EntryItemGrantAdvancement, EntryScaleValueAdvancement } from './indexUtils';

export type SubclassEntry = IndexEntry & {
  system: {
    advancement: (EntryItemGrantAdvancement | EntryScaleValueAdvancement)[];
    description: { value: string };
    identifier: string;
    classIdentifier: string;
    spellcasting: {
      ability: string;
      progression: string;
    };
  };
};

export async function getSubclassEntries() {
  const sourceEntries = await (getIndexEntriesForSource(SourceType.SUBCLASSES) as unknown as Promise<SubclassEntry[]>);
  // sanitize entries to remove anything nonconforming to a Subclass
  const subclassEntries = sourceEntries.filter((c) => c.type == 'subclass');
  if (getModuleSetting(SettingKeys.TRIM_SUBCLASSES)) {
    // Mostly for DDBImporter stuff: e.g "Assassin (Rogue)" > "Assassin"
    return subclassEntries.map((e) => ({ ...e, name: clearClassName(e.name) }));
  }
  return subclassEntries;
}

function clearClassName(name: string) {
  return name.lastIndexOf('(') > 0 ? name.substring(0, name.lastIndexOf('(') - 1).trim() : name;
}

export function addSubclassFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.SUBCLASSES].includes(packName)) {
    fieldsToIndex.add('system.advancement');
    fieldsToIndex.add('system.description.value'); // for sidebar
    fieldsToIndex.add('system.identifier');
    fieldsToIndex.add('system.classIdentifier');
    fieldsToIndex.add('system.spellcasting.ability');
    fieldsToIndex.add('system.spellcasting.progression');
  }
}

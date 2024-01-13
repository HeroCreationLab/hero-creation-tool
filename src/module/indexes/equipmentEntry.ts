import { SourceType, Sources } from '../settings';
import { IndexEntry } from './indexEntry';
import { getIndexEntriesForSource } from './indexUtils';

export type EquipmentEntry = IndexEntry & {
  system: {
    price: { value: number; denomination: string };
    rarity: string;
    quantity?: number;
  };
};

export async function getEquipmentEntries() {
  const equipmentEntries = await (getIndexEntriesForSource(SourceType.ITEMS) as unknown as Promise<EquipmentEntry[]>);
  // sanitize entries to remove anything nonconforming to an Item
  return equipmentEntries.filter((e) => !['class', 'feat', 'spell'].includes(e.type));
}

export function addEquipmentFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.ITEMS].includes(packName)) {
    fieldsToIndex.add('system.price');
    fieldsToIndex.add('system.rarity');
    fieldsToIndex.add('system.quantity');
    //fieldsToIndex.add('system.description'); maybe description to find Spellcasting Foci ?
  }
}

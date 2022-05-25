import { IndexEntry } from './indexUtils';
import { getGame } from './utils';

export async function getAll(entry: IndexEntry) {
  console.log('in getAdvancements');
  if (!entry._pack || !entry._id) return;

  const item = await getGame().packs.get(entry._pack)?.getDocument(entry._id);
  console.log(item);
}

export async function getItemGrantsForLevel(entry: IndexEntry, level: number) {
  console.log(`in getAdvancements for level ${level}`);
  if (!entry._pack || !entry._id) return;

  const item = await getGame().packs.get(entry._pack)?.getDocument(entry._id);
}

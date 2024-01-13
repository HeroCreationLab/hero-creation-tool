import { LOG_PREFIX } from '../constants';
import { getGame } from '../utils';
import { IndexEntry } from './entries/indexEntry';

export async function hydrateItems(indexEntries: Array<IndexEntry>): Promise<Item[]> {
  console.info(`${LOG_PREFIX} | Hydrating items:`);
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');

  const itemPromises = indexEntries.map(async (indexEntry) => {
    if ((indexEntry as any).custom) {
      return indexEntry; // return custom items as-is
    }
    const quantity = (indexEntry as any).system?.quantity;
    // if the entry has a local item, use that instead of fetching it from a compendium
    const item = indexEntry.local ?? (await game.packs.get(indexEntry._pack)?.getDocument(indexEntry._id));
    if (!item) throw new Error(`No item for id ${indexEntry._id}!`);
    const itemForEmbedding = worldItems.fromCompendium(item as Item);
    if (quantity) {
      (itemForEmbedding! as any).system.quantity = quantity;
    }
    if ((indexEntry as any)._advancement) {
      (itemForEmbedding as any)._advancement = (indexEntry as any)._advancement;
    }
    return itemForEmbedding;
  });
  return (await Promise.all(itemPromises)) as any;
}

export async function getIndexEntryByUuid(uuid: string): Promise<IndexEntry> {
  const { pack, id } = _parseUuid(uuid);

  if (pack === 'Item') {
    // local item, not from Compendium
    const item = getGame().items?.get(id);
    if (!item) {
      ui?.notifications?.error(getGame().i18n.format('HCT.Error.IndexEntryNotFound', { uuid }));
      throw new Error(`No index entry for uuid ${uuid}`);
    }
    return {
      _pack: item.pack!,
      _id: (item as any)._id!,
      _uuid: item.uuid,
      name: item.name!,
      type: item.type,
      img: item.img ?? '',
      local: item,
    };
  }

  await _onceAsync(() => (getGame().packs.get(pack) as any)?.getIndex({ fields: ['img'] }), pack);
  const packIndex = getGame().packs.get(pack)?.index;
  if (!packIndex) throw new Error(`Pack ${pack} not indexed or index not found`);
  // await (packCollection as any)?.getIndex({ fields: ['img'] });

  const indexedEntry = packIndex.find((i) => i._id === id) as IndexEntry;
  if (!indexedEntry) {
    ui?.notifications?.error(getGame().i18n.format('HCT.Error.IndexEntryNotFound', { uuid }));
    throw new Error(`No index entry for uuid ${uuid}`);
  }
  return {
    ...indexedEntry,
    _pack: pack,
    _uuid: uuid,
  };
}

function _parseUuid(uuid: string): { pack: any; id: any } {
  const firstDot = uuid.indexOf('.');
  const lastDot = uuid.lastIndexOf('.');

  const pack = uuid.startsWith('Item') ? 'Item' : uuid.substring(firstDot + 1, lastDot);
  const id = uuid.substring(lastDot + 1);
  return { pack, id };
}

const _onceAsync = (() => {
  const indexedPacks: Map<string, Promise<void>> = new Map<string, Promise<void>>();

  return function (loader: () => Promise<void> | undefined, packName: string) {
    const p = indexedPacks.get(packName);
    if (p) return p;
    const newPromise = Promise.resolve(loader());
    newPromise.catch(() => indexedPacks.delete(packName));
    indexedPacks.set(packName, newPromise);
    return newPromise;
  };
})();

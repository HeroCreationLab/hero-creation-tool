import { LOG_PREFIX, MODULE_ID } from '../constants';
import SettingKeys, { Sources } from '../settings';
import { getGame } from '../utils';
import { addBackgroundFields } from './backgroundEntry';
import { addClassFields } from './classEntry';
import { addEquipmentFields } from './equipmentEntry';
import { addFeatFields } from './featEntry';
import { IndexEntry } from './indexEntry';
import { addRaceFields } from './raceEntry';
import { addRacialFeaturesFields } from './racialFeatureEntry';
import { addSpellFields } from './spellEntry';
import { addSubclassFields } from './subclassEntry';

/***
 * Builds the indexes for all sources.
 * (note that items without a source compendium are not indexed,
 *  like Class Features or Backgrounds, as they are taken from advancements)
 */
export async function buildSourceIndexes() {
  console.info(`${LOG_PREFIX} | Indexing source compendiums`);
  const sourcePacks: Sources = (await game.settings.get(MODULE_ID, SettingKeys.SOURCES)) as Sources;
  const itemsPromises: Promise<Item | null | undefined>[] = [];
  game.packs
    .filter((p) => p.documentName == 'Item')
    .forEach((p) => {
      const name = p.collection;
      const fieldsToIndex = new Set<string>();

      // name added by default on all when indexed
      addRaceFields(fieldsToIndex, sourcePacks, name);
      addRacialFeaturesFields(fieldsToIndex, sourcePacks, name);
      addClassFields(fieldsToIndex, sourcePacks, name);
      addSubclassFields(fieldsToIndex, sourcePacks, name);
      addSpellFields(fieldsToIndex, sourcePacks, name);
      addFeatFields(fieldsToIndex, sourcePacks, name);
      addBackgroundFields(fieldsToIndex, sourcePacks, name);
      addEquipmentFields(fieldsToIndex, sourcePacks, name);

      if (fieldsToIndex.size) {
        fieldsToIndex.add('img');
        itemsPromises.push((p as any).getIndex({ fields: [...fieldsToIndex] }));
      }
    });
  await Promise.all(itemsPromises);
}

export async function getIndexEntriesForSource(source: keyof Sources) {
  const sources: Sources = (await game.settings.get(MODULE_ID, SettingKeys.SOURCES)) as Sources;

  const indexEntries = [];
  for (const packName of sources[source]) {
    const pack = game.packs.get(packName);
    if (!pack) ui.notifications?.warn(`No pack for name [${packName}]!`);
    if (pack?.documentName !== 'Item') throw new Error(`${packName} is not an Item pack`);
    const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
    if ((itemPack as any).indexed) {
      const packIndexEntries = [...(await itemPack.index)];
      indexEntries.push(
        ...packIndexEntries.map((e) => ({ ...e, _pack: packName, _uuid: _buildUuid(e._id, packName) })),
      );
    } else {
      console.error(`Index not built for pack [${packName}] - skipping it`);
    }
  }
  return indexEntries;
}

function _buildUuid(id: string, pack?: string): string {
  //'Compendium.dnd5e.spells.04nMsTWkIFvkbXlY'
  //'Item.PbEAMotRyx4yLbNq'
  if (!id) throw new Error('UUID needs a Document id');
  const location = pack ? 'Compendium.' + pack : 'Item';
  return `${location}.${id}`;
}

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
  const { pack, id } = parseUuid(uuid);

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

function parseUuid(uuid: string): { pack: any; id: any } {
  const firstDot = uuid.indexOf('.');
  const lastDot = uuid.lastIndexOf('.');

  const pack = uuid.startsWith('Item') ? 'Item' : uuid.substring(firstDot + 1, lastDot);
  const id = uuid.substring(lastDot + 1);
  return { pack, id };
}

export type EntryAdvancement = {
  _id: string;
  icon: string;
  type: string;
  title: string;
};

export type EntryHitPointsAdvancement = EntryAdvancement & {
  type: 'HitPoints';
};

export type EntryItemGrantAdvancement = EntryAdvancement & {
  type: 'ItemGrant';
  level: number;
  configuration: {
    items: string[];
  };
};

export type EntryScaleValueAdvancement = EntryAdvancement & {
  type: 'ScaleValue';
  title: string;
  configuration: {
    identifier: string;
    type: string;
    scale: { [key: number]: { value: number } };
  };
};

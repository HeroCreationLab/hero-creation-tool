import { DEFAULT_PACKS, LOG_PREFIX, MODULE_ID } from '../constants';
import SettingKeys, { Source, SourceType } from '../settings';
import { getGame, getModuleSetting } from '../utils';

/***
 * Builds the indexes for all sources.
 * (note that items without a source compendium are not indexed,
 *  like Class Features or Backgrounds, as they are taken from advancements)
 */
export async function buildSourceIndexes() {
  console.info(`${LOG_PREFIX} | Indexing source compendiums`);
  const sourcePacks: Source = (await game.settings.get(MODULE_ID, SettingKeys.SOURCES)) as Source;
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
      // addClassFeaturesFields(fieldsToIndex, sourcePacks, name);
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

export async function buildJournalIndexes() {
  console.info(`${LOG_PREFIX} | Indexing journals (rules)`);
  const rulesPack = game.packs.get(DEFAULT_PACKS.RULES);
  if (!rulesPack) {
    throw new Error(
      `${LOG_PREFIX} | Cannot find default DnD5e rules compendium (for indexing sidepanel rules) under name ${DEFAULT_PACKS.RULES}`,
    );
  }
  await (rulesPack as any).getIndex({ fields: ['name', 'content'] });
}

export async function getRuleJournalEntryByName(journalName: string) {
  const entries = await (game.packs.get(DEFAULT_PACKS.RULES)?.index as unknown as Promise<RuleEntry[]>);
  return entries.find((e) => e.name === journalName);
}

export async function getIndexEntriesForSource(source: keyof Source) {
  const sources: Source = (await game.settings.get(MODULE_ID, SettingKeys.SOURCES)) as Source;

  const indexEntries = [];
  for (const packName of sources[source]) {
    const pack = game.packs.get(packName);
    if (!pack) ui.notifications?.warn(`No pack for name [${packName}]!`);
    if (pack?.documentName !== 'Item') throw new Error(`${packName} is not an Item pack`);
    const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
    if ((itemPack as any).indexed) {
      const packIndexEntries = [...(await itemPack.index)];
      indexEntries.push(...packIndexEntries.map((e) => ({ ...e, _pack: packName })));
    } else {
      console.error(`Index not built for pack [${packName}] - skipping it`);
    }
  }
  return indexEntries;
}

export async function hydrateItems(indexEntries: Array<IndexEntry>): Promise<Item[]> {
  console.info(`${LOG_PREFIX} | Hydrating items:`);
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');

  const itemPromises = indexEntries.map(async (indexEntry) => {
    if ((indexEntry as any).custom) {
      return indexEntry; // return custom items as-is
    }
    const quantity = (indexEntry as any).data?.quantity;
    // if the entry has a local item, use that instead of fetching it from a compendium
    const item = indexEntry.local ?? (await game.packs.get(indexEntry._pack)?.getDocument(indexEntry._id));
    if (!item) throw new Error(`No item for id ${indexEntry._id}!`);
    const itemForEmbedding = worldItems.fromCompendium(item as Item);
    if (quantity) {
      (itemForEmbedding!.data as any).quantity = quantity;
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
    return toIndexEntry(item);
  }

  await onceAsync(() => (getGame().packs.get(pack) as any)?.getIndex({ fields: ['img'] }), pack);
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
  };
}

const onceAsync = (() => {
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

function toIndexEntry(item: Item): IndexEntry {
  return {
    _pack: item.pack!,
    _id: item.data._id!,
    name: item.name!,
    type: item.type,
    img: item.img ?? '',
    local: item,
  };
}

function parseUuid(uuid: string): { pack: any; id: any } {
  const firstDot = uuid.indexOf('.');
  const lastDot = uuid.lastIndexOf('.');

  const pack = uuid.startsWith('Item') ? 'Item' : uuid.substring(firstDot + 1, lastDot);
  const id = uuid.substring(lastDot + 1);
  return { pack, id };
}

export type IndexEntry = {
  _id: string;
  _pack: string;
  type: string;
  name: string;
  img: string;
  local?: Item; // for cases where we take the item from the directory instead of from a compendium index
};

export type EntryAdvancement = {
  _id: string;
  icon: string;
  type: string;
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

// Race
export type RaceEntry = IndexEntry & {
  data: {
    requirements: string;
    description: { value: string };
  };
};
export function addRaceFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.RACES].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // for figuring subraces
    fieldsToIndex.add('data.description.value'); // for sidebar
  }
}
export async function getRaceEntries() {
  const raceEntries = await (getIndexEntriesForSource(SourceType.RACES) as unknown as Promise<RaceEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now, until Race becomes a type)
  return raceEntries.filter((r) => r.type == 'feat');
}

// Race Feature
export type RacialFeatureEntry = IndexEntry & {
  data: { requirements: string };
};
export function addRacialFeaturesFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.RACIAL_FEATURES].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // for mapping racial features to races/subraces
  }
}
export async function getRaceFeatureEntries() {
  const raceFeatureEntries = await (getIndexEntriesForSource(SourceType.RACIAL_FEATURES) as unknown as Promise<
    RacialFeatureEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Race Features become a type in the future)
  return raceFeatureEntries.filter((f) => f.type == 'feat' && f?.data?.requirements !== '');
}

// Class
export type ClassEntry = IndexEntry & {
  data: {
    advancement: (EntryHitPointsAdvancement | EntryItemGrantAdvancement | EntryScaleValueAdvancement)[];
    description: { value: string };
    identifier: string;
    hitDice: string;
    saves: string[];
    levels: number;
    skills: {
      number: number;
      choices: string[];
      value: string[];
    };
    spellcasting: {
      ability: string;
      progression: string;
    };
  };
};
export function addClassFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.CLASSES].includes(packName)) {
    fieldsToIndex.add('data.advancement');
    fieldsToIndex.add('data.description.value'); // for sidebar
    fieldsToIndex.add('data.identifier');
    fieldsToIndex.add('data.hitDice');
    fieldsToIndex.add('data.saves');
    fieldsToIndex.add('data.skills');
    fieldsToIndex.add('data.spellcasting');
  }
}
export async function getClassEntries() {
  const classEntries = await (getIndexEntriesForSource(SourceType.CLASSES) as unknown as Promise<ClassEntry[]>);
  // sanitize entries to remove anything nonconforming to a Class
  return classEntries.filter((c) => c.type == 'class');
}

// Class Feature
export type ClassFeatureEntry = IndexEntry & {
  data: {
    description: { value: string };
    requirements: string;
  };
  _advancement: {
    id: string;
    uuid: string;
    lv?: number;
  };
};
// export function addClassFeaturesFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
//   if (source[SourceType.CLASS_FEATURES].includes(packName)) {
//     fieldsToIndex.add('data.requirements'); // for mapping class features to classes
//     fieldsToIndex.add('data.description'); // used to show Spellcasting/Pact Magic features on the Spells tab
//   }
// }
export async function getClassFeatureEntries() {
  const classFeatureEntries = await (getIndexEntriesForSource(SourceType.CLASS_FEATURES) as unknown as Promise<
    ClassFeatureEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Class Features become a type in the future)
  return classFeatureEntries.filter((f) => f.type == 'feat' && f?.data?.requirements !== '');
}

// Subclass
export type SubclassEntry = IndexEntry & {
  data: {
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
export function addSubclassFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.SUBCLASSES].includes(packName)) {
    fieldsToIndex.add('data.advancement');
    fieldsToIndex.add('data.description.value'); // for sidebar
    fieldsToIndex.add('data.identifier');
    fieldsToIndex.add('data.classIdentifier');
    fieldsToIndex.add('data.spellcasting.ability');
    fieldsToIndex.add('data.spellcasting.progression');
  }
}
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

// Background
export type BackgroundEntry = IndexEntry & unknown;
export function addBackgroundFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.BACKGROUNDS].includes(packName)) {
    fieldsToIndex.add('name');
  }
}
export async function getBackgroundEntries() {
  const backgroundEntries = await (getIndexEntriesForSource(SourceType.BACKGROUNDS) as unknown as Promise<
    BackgroundEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Background Features become a type in the future)
  return backgroundEntries.filter((f) => f.type == 'background');
}

// Equipment
export type EquipmentEntry = IndexEntry & {
  data: {
    price: number;
    rarity: string;
    quantity?: number;
  };
};
export function addEquipmentFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.ITEMS].includes(packName)) {
    fieldsToIndex.add('data.price');
    fieldsToIndex.add('data.rarity');
    fieldsToIndex.add('data.quantity');
    //fieldsToIndex.add('data.description'); maybe description to find Spellcasting Foci ?
  }
}
export async function getEquipmentEntries() {
  const equipmentEntries = await (getIndexEntriesForSource(SourceType.ITEMS) as unknown as Promise<EquipmentEntry[]>);
  // sanitize entries to remove anything nonconforming to an Item
  return equipmentEntries.filter((e) => !['class', 'feat', 'spell'].includes(e.type));
}

// Spell
export type SpellEntry = IndexEntry & {
  data: {
    level: number;
  };
};
export function addSpellFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.SPELLS].includes(packName)) {
    fieldsToIndex.add('data.level');
  }
}
export async function getSpellEntries() {
  const spellEntries = await (getIndexEntriesForSource(SourceType.SPELLS) as unknown as Promise<SpellEntry[]>);
  // sanitize entries to remove anything nonconforming to a Spell
  return spellEntries.filter((s) => s.type == 'spell');
}

// Feat
export type FeatEntry = IndexEntry & {
  data: { requirements: string };
};
export function addFeatFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.FEATS].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // TODO if feat has a requirement show it.
  }
}
export async function getFeatEntries() {
  const featEntries = await (getIndexEntriesForSource(SourceType.FEATS) as unknown as Promise<FeatEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Feats become a type in the future)
  return featEntries.filter((f) => f.type == 'feat');
}

// Rule
export type RuleEntry = {
  _id: string;
  name: string;
  content: string;
};

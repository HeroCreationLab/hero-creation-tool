import * as CONSTANTS from './constants';
import SettingKeys, { Source, SourceType } from './settings';

export async function buildSourceIndexes() {
  console.log(`${CONSTANTS.LOG_PREFIX} | Indexing source compendiums`);
  const sourcePacks: Source = (await game.settings.get(CONSTANTS.MODULE_NAME, SettingKeys.SOURCES)) as Source;
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
      addClassFeaturesFields(fieldsToIndex, sourcePacks, name);
      addSpellFields(fieldsToIndex, sourcePacks, name);
      addFeatFields(fieldsToIndex, sourcePacks, name);
      addBackgroundFeaturesFields(fieldsToIndex, sourcePacks, name);

      if (fieldsToIndex.size) {
        fieldsToIndex.add('img');
        itemsPromises.push((p as any).getIndex({ fields: [...fieldsToIndex] }));
      }
    });
  await Promise.all(itemsPromises);
}

export async function buildEquipmentAndJournalIndexes() {
  console.log(`${CONSTANTS.LOG_PREFIX} | Indexing items (equipment) and journals (rules)`);
  const itemsPack = game.packs.get(CONSTANTS.DEFAULT_PACKS.ITEMS);
  if (!itemsPack) {
    throw new Error(
      `${CONSTANTS.LOG_PREFIX} | Cannot find default DnD5e items compendium (for indexing equipment) under name ${CONSTANTS.DEFAULT_PACKS.ITEMS}`,
    );
  }
  await (itemsPack as any).getIndex({ fields: ['img', 'data.price', 'data.rarity'] });

  const rulesPack = game.packs.get(CONSTANTS.DEFAULT_PACKS.RULES);
  if (!rulesPack) {
    throw new Error(
      `${CONSTANTS.LOG_PREFIX} | Cannot find default DnD5e rules compendium (for indexing sidepanel rules) under name ${CONSTANTS.DEFAULT_PACKS.RULES}`,
    );
  }
  await (rulesPack as any).getIndex({ fields: ['name', 'content'] });
}

export async function getRaceEntries() {
  const raceEntries = await ((getIndexEntriesForSource(SourceType.RACES) as unknown) as Promise<RaceEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now, until Race becomes a type)
  return raceEntries.filter((r) => r.type == 'feat');
}

export async function getRaceFeatureEntries() {
  const raceFeatureEntries = await ((getIndexEntriesForSource(SourceType.RACIAL_FEATURES) as unknown) as Promise<
    RacialFeatureEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Race Features become a type in the future)
  return raceFeatureEntries.filter((f) => f.type == 'feat' && f?.data?.requirements !== '');
}

export async function getClassEntries() {
  const classEntries = await ((getIndexEntriesForSource(SourceType.CLASSES) as unknown) as Promise<ClassEntry[]>);
  // sanitize entries to remove anything nonconforming to a Class
  return classEntries.filter((c) => c.type == 'class');
}

export async function getClassFeatureEntries() {
  const classFeatureEntries = await ((getIndexEntriesForSource(SourceType.CLASS_FEATURES) as unknown) as Promise<
    RacialFeatureEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Class Features become a type in the future)
  return classFeatureEntries.filter((f) => f.type == 'feat' && f?.data?.requirements !== '');
}

export async function getSpellEntries() {
  const spellEntries = await ((getIndexEntriesForSource(SourceType.SPELLS) as unknown) as Promise<SpellEntry[]>);
  // sanitize entries to remove anything nonconforming to a Spell
  return spellEntries.filter((s) => s.type == 'spell');
}

export async function getBackgroundFeatureEntries() {
  const backgroundFeatureEntries = await ((getIndexEntriesForSource(
    SourceType.BACKGROUND_FEATURES,
  ) as unknown) as Promise<BackgroundFeatureEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Background Features become a type in the future)
  return backgroundFeatureEntries.filter((f) => f.type == 'feat');
}

export async function getFeatEntries() {
  const featEntries = await ((getIndexEntriesForSource(SourceType.FEATS) as unknown) as Promise<FeatEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Feats become a type in the future)
  return featEntries.filter((f) => f.type == 'feat');
}

export async function getEquipmentEntries() {
  const equipmentEntries = await ((game.packs.get(CONSTANTS.DEFAULT_PACKS.ITEMS)?.index as unknown) as Promise<
    EquipmentEntry[]
  >);
  return equipmentEntries
    .filter((e) => !['class', 'feat', 'spell'].includes(e.type))
    .map((e) => ({ ...e, _pack: CONSTANTS.DEFAULT_PACKS.ITEMS }));
}

export async function getRuleJournalEntryByName(journalName: string) {
  const entries = await ((game.packs.get(CONSTANTS.DEFAULT_PACKS.RULES)?.index as unknown) as Promise<RuleEntry[]>);
  return entries.find((e) => e.name === journalName);
}

async function getIndexEntriesForSource(source: keyof Source) {
  const sources: Source = (await game.settings.get(CONSTANTS.MODULE_NAME, SettingKeys.SOURCES)) as Source;

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
  console.log(`${CONSTANTS.LOG_PREFIX} | Hydrating items:`);
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');

  const itemPromises = indexEntries.map(async (indexEntry) => {
    if ((indexEntry as any).custom) {
      return indexEntry; // return custom items as-is
    }
    const quantity = (indexEntry as any).data?.quantity;
    const item = await game.packs.get(indexEntry._pack)?.getDocument(indexEntry._id);
    if (!item) throw new Error(`No item for id ${indexEntry._id}!`);
    const itemForEmbedding = worldItems.fromCompendium(item as Item);
    if (quantity) {
      (itemForEmbedding!.data as any).quantity = quantity;
    }
    return itemForEmbedding;
  });
  return (await Promise.all(itemPromises)) as any;
}

// Entry types & functions that add corresponding fields for index creation
export type IndexEntry = {
  _id: string;
  _pack: string;
  type: string;
  name: string;
  img: string;
};

export type RaceEntry = IndexEntry & {
  data: {
    requirements: string;
    description: { value: string };
  };
};
function addRaceFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.RACES].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // for figuring subraces
    fieldsToIndex.add('data.description.value'); // for sidebar
  }
}

export type RacialFeatureEntry = IndexEntry & {
  data: { requirements: string };
};
function addRacialFeaturesFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.RACIAL_FEATURES].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // for mapping racial features to races/subraces
  }
}

export type ClassEntry = IndexEntry & {
  data: {
    description: { value: string };
    hitDice: string;
    saves: string[];
    skills: {
      number: number;
      choices: string[];
      value: string[];
    };
    spellcasting: {
      ability: string;
      progression: string;
    };
    levels: number;
  };
};
function addClassFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.CLASSES].includes(packName)) {
    fieldsToIndex.add('data.description.value'); // for sidebar
    fieldsToIndex.add('data.hitDice');
    fieldsToIndex.add('data.saves');
    fieldsToIndex.add('data.skills');
    fieldsToIndex.add('data.spellcasting');
  }
}

export type ClassFeatureEntry = IndexEntry & {
  data: { requirements: string };
};
function addClassFeaturesFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.CLASS_FEATURES].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // for mapping class features to classes
  }
}

export type SpellEntry = IndexEntry & {
  data: {
    level: number;
  };
};
function addSpellFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.SPELLS].includes(packName)) {
    fieldsToIndex.add('data.level');
  }
}

export type FeatEntry = IndexEntry & {
  data: { requirements: string };
};
function addFeatFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.FEATS].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // unsure if will be used, would like to at least mention the requirement.
  }
}

export type BackgroundFeatureEntry = IndexEntry & {
  data: {
    requirements: string;
    source: string;
  };
};
function addBackgroundFeaturesFields(fieldsToIndex: Set<string>, source: Source, packName: string) {
  if (source[SourceType.BACKGROUND_FEATURES].includes(packName)) {
    fieldsToIndex.add('data.requirements'); // to map possible background names
    fieldsToIndex.add('data.source'); // to make sure this is a background feature
  }
}

export type EquipmentEntry = IndexEntry & {
  data: {
    price: number;
    rarity: string;
    quantity?: number;
  };
};

export type RuleEntry = {
  _id: string;
  name: string;
  content: string;
};

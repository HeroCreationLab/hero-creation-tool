import { MODULE_ID } from '../constants';
import SettingKeys, { SourceType, Sources } from '../settings';
import { getModuleSetting } from '../utils';
import { BackgroundEntry } from './entries/backgroundEntry';
import { ClassEntry } from './entries/classEntry';
import { EquipmentEntry } from './entries/equipmentEntry';
import { FeatEntry } from './entries/featEntry';
import { RaceEntry } from './entries/raceEntry';
import { RacialFeatureEntry } from './entries/racialFeatureEntry';
import { SpellEntry } from './entries/spellEntry';
import { SubclassEntry } from './entries/subclassEntry';

async function _getIndexEntriesForSource(source: keyof Sources) {
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

export async function getBackgroundEntries() {
  const backgroundEntries = await (_getIndexEntriesForSource(SourceType.BACKGROUNDS) as unknown as Promise<
    BackgroundEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Background Features become a type in the future)
  return backgroundEntries.filter((f) => f.type == 'background');
}

export async function getClassEntries() {
  const classEntries = await (_getIndexEntriesForSource(SourceType.CLASSES) as unknown as Promise<ClassEntry[]>);
  // sanitize entries to remove anything nonconforming to a Class
  return classEntries.filter((c) => c.type == 'class');
}

export async function getEquipmentEntries() {
  const equipmentEntries = await (_getIndexEntriesForSource(SourceType.ITEMS) as unknown as Promise<EquipmentEntry[]>);
  // sanitize entries to remove anything nonconforming to an Item
  return equipmentEntries.filter((e) => !['class', 'feat', 'spell', 'race'].includes(e.type));
}

export async function getFeatEntries() {
  const featEntries = await (_getIndexEntriesForSource(SourceType.FEATS) as unknown as Promise<FeatEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Feats become a type in the future)
  return featEntries.filter((f) => f.type == 'feat');
}

export async function getRaceEntries() {
  const raceEntries = await (_getIndexEntriesForSource(SourceType.RACES) as unknown as Promise<RaceEntry[]>);
  // sanitize entries to remove anything nonconforming to a Feature (for now, until Race becomes a type)
  return raceEntries.filter((r) => r.type == 'race');
}

export async function getRaceFeatureEntries() {
  const raceFeatureEntries = await (_getIndexEntriesForSource(SourceType.RACIAL_FEATURES) as unknown as Promise<
    RacialFeatureEntry[]
  >);
  // sanitize entries to remove anything nonconforming to a Feature (for now at least, if Race Features become a type in the future)
  return raceFeatureEntries.filter((f) => f.type == 'feat' && f?.system?.type?.value == 'race');
}

export async function getSpellEntries() {
  const spellEntries = await (_getIndexEntriesForSource(SourceType.SPELLS) as unknown as Promise<SpellEntry[]>);
  // sanitize entries to remove anything nonconforming to a Spell
  return spellEntries.filter((s) => s.type == 'spell');
}

export async function getSubclassEntries() {
  const sourceEntries = await (_getIndexEntriesForSource(SourceType.SUBCLASSES) as unknown as Promise<SubclassEntry[]>);
  // sanitize entries to remove anything nonconforming to a Subclass
  const subclassEntries = sourceEntries.filter((c) => c.type == 'subclass');
  if (getModuleSetting(SettingKeys.TRIM_SUBCLASSES)) {
    // Mostly for DDBImporter stuff: e.g "Assassin (Rogue)" > "Assassin"
    return subclassEntries.map((e) => ({ ...e, name: _clearClassName(e.name) }));
  }
  return subclassEntries;
}

function _clearClassName(name: string) {
  return name.lastIndexOf('(') > 0 ? name.substring(0, name.lastIndexOf('(') - 1).trim() : name;
}

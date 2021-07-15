import * as Constants from './constants';

type getSourcesOptions = {
  baseSource: string;
  customSourcesProperty?: string;
};
/**
 * @param baseSource pack name of the base source
 * @param customSources property that holds the array of pack names of custom sources
 */
export async function getSources({ baseSource: baseSource, customSourcesProperty }: getSourcesOptions) {
  const packs: string[] = [];
  if (!baseSource) {
    throw new Error(`Invalid base source value: ${baseSource}`);
  }
  packs.push(baseSource);
  if (customSourcesProperty) {
    const propValue: string = (await game.settings.get(Constants.MODULE_NAME, customSourcesProperty)) as string;
    if (propValue) {
      const customSources: string[] = propValue.split(';');
      packs.push(...customSources);
    }
  }
  return await getItemListFromPackListByNames(packs);
}

async function getItemListFromPackListByNames(packNames: string[]) {
  const allItems = [];
  for (const compendiumName of packNames) {
    const pack = game.packs.get(compendiumName);
    const worldItems = game.items;
    if (!worldItems) throw new Error('game.items not initialized yet');
    if (!pack) ui.notifications?.warn(`No pack for name [${compendiumName}]!`);
    if (pack?.documentName !== 'Item') throw new Error(`${compendiumName} is not an Item pack`);
    const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
    const itemsPromises: Promise<Item | null | undefined>[] = [];
    for (const itemIndex of pack.index.keys()) {
      const item = itemPack.getDocument(itemIndex);
      itemsPromises.push(item);
    }
    const items = await Promise.all(itemsPromises);
    allItems.push(...items.filter((item): item is Item => !!item).map((item) => worldItems.fromCompendium(item)));
  }
  return allItems;
}

export async function getJournalFromPackByName(packName: string, itemName: string) {
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');

  const pack = game.packs.get(packName);
  if (!pack) throw new Error(`No pack for name [${packName}]!`);
  if (pack.documentName !== 'JournalEntry') throw new Error(`${packName} is not an JournalEntry pack`);

  const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
  const index = itemPack.index.getName(itemName) as any;
  if (!index) throw new Error(`No index for item name ${itemName}!`);
  const item = await itemPack.getDocument(index._id);
  if (!item) throw new Error(`No item for id ${index._id}!`);
  return worldItems.fromCompendium(item);
}

export async function getItemFromPackByName(packName: string, itemName: string) {
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');

  const pack = game.packs.get(packName);
  if (!pack) throw new Error(`No pack for name ${packName}!`);
  if (pack.documentName !== 'Item') throw new Error(`${packName} is not an Item pack`);

  const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
  const index = itemPack.index.getName(itemName) as any;
  if (!index) throw new Error(`No index for item name ${itemName}!`);
  const item = await itemPack.getDocument(index._id);
  if (!item) throw new Error(`No item for id ${index._id}!`);
  return worldItems.fromCompendium(item);
}

export async function getItemFromPackByIndexId(packName: string, itemId: string) {
  const pack = game.packs.get(packName);
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');
  if (!pack) throw new Error(`No pack for name ${packName}!`);
  if (pack.documentName !== 'Item') throw new Error(`${packName} is not an Item pack`);

  const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
  const item = await itemPack.getDocument(itemId);
  if (!item) throw new Error(`No item for id ${itemId}!`);
  return worldItems.fromCompendium(item);
}

export function getAbilityModifierValue(value: number) {
  return Math.floor((value - 10) / 2);
}

export function modifierSign(val: number) {
  return val >= 0 ? `+${val}` : `-${val}`;
}

export function isCustomKey(key: string, value: string): boolean {
  const dnd5e = (game as any).dnd5e;
  let keyList: any;
  switch (key) {
    case 'weaponProf':
      keyList = Object.keys(dnd5e.config.weaponProficiencies);
      break;
    case 'armorProf':
      keyList = Object.keys(dnd5e.config.armorProficiencies);
      break;
    case 'toolProf':
      keyList = Object.keys(dnd5e.config.toolProficiencies);
      break;
    case 'languages':
      keyList = Object.keys(dnd5e.config.languages);
      break;
  }
  for (const key in keyList) {
    if (keyList[key] === value) return false;
  }
  return true;
}

export function isProficiencyKey(key: string): boolean {
  if (key.indexOf('skill') > -1) return true;
  if (key.indexOf('language') > -1) return true;
  if (key.indexOf('weapon') > -1) return true;
  if (key.indexOf('armor') > -1) return true;
  if (key.indexOf('tool') > -1) return true;
  return false;
}

export function getActorDataForProficiency(key: string, value: any): [key: string, value: any] {
  if (!isProficiencyKey(key)) return [key, value];

  if (Array.isArray(value) && value.length == 1) {
    value = value[0];
  }
  const baseKey = 'data.traits';
  let pair: [string, any];
  if (key === 'skills') {
    pair = [`data.skills.${value}.value`, 1];
  } else {
    if (isCustomKey(key, value)) pair = [`${baseKey}.${key}.custom`, value];
    else pair = [`${baseKey}.${key}.value`, [value]];
  }
  return pair;
}

export type filterPackOptions = { filterValues: string[]; filterField: string; itemList: Item[] };
export function filterItemList({ filterValues, filterField, itemList }: filterPackOptions): Item[] {
  if (!itemList) return [];
  const filtered = itemList.filter((item: any) => {
    const req: string = getProperty(item, filterField);
    let reqs: string[];
    if (req.indexOf(',') > -1) {
      // feature applies for multiple classes / races / levels
      reqs = req.split(',').map((r) => r.trim());
    } else {
      reqs = [req];
    }
    return reqs.some((r) => filterValues.includes(r) && !filterValues.includes(item.name));
  });
  return filtered;
}

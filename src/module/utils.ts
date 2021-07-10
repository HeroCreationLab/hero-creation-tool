import { ArmorType } from './types/ArmorType';
import { Language } from './types/Language';
import { Tool } from './types/Tool';
import { WeaponType } from './types/WeaponType';

export async function getItemListFromCompendiumByName(compendiumName: string) {
  return getItemListFromCompendiumListByNames([compendiumName]);
}

export async function getItemListFromCompendiumListByNames(compendiumNames: string[]) {
  const allItems = [];
  for (const compendiumName of compendiumNames) {
    const pack = game.packs.get(compendiumName);
    const worldItems = game.items;
    if (!worldItems) throw new Error('game.items not initialized yet');
    if (!pack) ui.notifications?.warn(`No pack for name ${compendiumName}!`);
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

export async function getJournalFromCompendiumByName(compendiumName: string, itemName: string) {
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');

  const pack = game.packs.get(compendiumName);
  if (!pack) throw new Error(`No pack for name ${compendiumName}!`);
  if (pack.documentName !== 'JournalEntry') throw new Error(`${compendiumName} is not an JournalEntry pack`);

  const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
  const index = itemPack.index.getName(itemName) as any;
  if (!index) throw new Error(`No index for item name ${itemName}!`);
  const item = await itemPack.getDocument(index._id);
  if (!item) throw new Error(`No item for id ${index._id}!`);
  return worldItems.fromCompendium(item);
}

export async function getItemFromCompendiumByName(compendiumName: string, itemName: string) {
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');

  const pack = game.packs.get(compendiumName);
  if (!pack) throw new Error(`No pack for name ${compendiumName}!`);
  if (pack.documentName !== 'Item') throw new Error(`${compendiumName} is not an Item pack`);

  const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
  const index = itemPack.index.getName(itemName) as any;
  if (!index) throw new Error(`No index for item name ${itemName}!`);
  const item = await itemPack.getDocument(index._id);
  if (!item) throw new Error(`No item for id ${index._id}!`);
  return worldItems.fromCompendium(item);
}

export async function getItemFromCompendiumByIndexId(compendiumName: string, itemId: string) {
  const pack = game.packs.get(compendiumName);
  const worldItems = game.items;
  if (!worldItems) throw new Error('game.items not initialized yet');
  if (!pack) throw new Error(`No pack for name ${compendiumName}!`);
  if (pack.documentName !== 'Item') throw new Error(`${compendiumName} is not an Item pack`);

  const itemPack = pack as CompendiumCollection<CompendiumCollection.Metadata & { entity: 'Item' }>;
  const item = await itemPack.getDocument(itemId);
  if (!item) throw new Error(`No item for id ${itemId}!`);
  return worldItems.fromCompendium(item);
}

export function getSkillNameByKey(key: string) {
  return game.i18n.localize(`DND5E.Skill${key.capitalize()}`);
}

export function getAbilityNameByKey(key: string) {
  return key === 'any' ? '' : game.i18n.localize(`DND5E.Ability${key.capitalize()}`);
}

export function getAbilityModifierValue(value: number) {
  return Math.floor((value - 10) / 2);
}

export function modifierSign(val: number) {
  return val >= 0 ? `+${val}` : `-${val}`;
}

export function openTab(index: number): void {
  handleNavs(index);
  $('.tab-body').hide();
  $('.tablinks').removeClass('active');
  $(`[data-hct_tab_index=${index}]`).addClass('active');
  $(`[data-hct_tab_section=${index}]`).show();
}

function handleNavs(index: number) {
  // hides the tabs if switching to startDiv, else show them.
  $('.hct-container .tabs').toggle(index !== 0);

  // disables back/next buttons where appropriate
  const $footer = $('.hct-container footer');
  $('[data-hct_back]', $footer).prop('disabled', index == 0);
  $('[data-hct_next]', $footer).prop('disabled', index == 8);
}

export function isCustomKey(key: string, value: string): boolean {
  let keyList: any;
  switch (key) {
    case 'weaponProf':
      keyList = WeaponType;
      break;
    case 'armorProf':
      keyList = ArmorType;
      break;
    case 'toolProf':
      keyList = Tool;
      break;
    case 'languages':
      keyList = Language;
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

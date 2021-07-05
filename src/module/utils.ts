import { WeaponType } from './types/WeaponType';

export async function getItemListFromCompendiumByName(compendiumName: string) {
  const pack = game.packs.get(compendiumName);
  const items: Item[] = [];
  for (const itemIndex of pack.index.keys()) {
    items.push(pack.getDocument(itemIndex));
  }
  return await (await Promise.all(items)).map((i) => game.items.fromCompendium(i));
}

export async function getItemFromCompendiumByName(compendiumName: string, itemName: string) {
  const pack = game.packs.get(compendiumName);
  const index = pack.index.getName(itemName);
  const item = await pack.getDocument(index._id);
  return game.items.fromCompendium(item);
}

export async function getItemFromCompendiumByIndexId(compendiumName: string, itemId: string) {
  const pack = game.packs.get(compendiumName);
  const item = await pack.getDocument(itemId);
  return game.items.fromCompendium(item);
}

export function getSkillNameByKey(key: string) {
  return game.i18n.localize(`DND5E.Skill${key.capitalize()}`);
}

export function getAbilityNameByKey(key: string) {
  return key === 'any' ? game.i18n.localize(`HCT.Common.ANY`) : game.i18n.localize(`DND5E.Ability${key.capitalize()}`);
}

export function getAbilityModifierValue(value: number) {
  return Math.floor((value - 10) / 2);
}

export function modifierSign(val: number) {
  return val >= 0 ? `+${val}` : `-${val}`;
}

export function openTab(id: string): void {
  $('.hct-container .tabs').toggle(id !== 'startDiv'); // hides the tabs if switching to startDiv, else show them.

  $('.tab-body').hide();
  $('.tablinks').removeClass('active');
  $(`[data-hct_tab=${id}]`).addClass('active');
  $(`#${id}`).show();
}

export function getValueFromInnerProperty(obj: any, key: string): any {
  const keyParts: string[] = key.split('.');
  if (keyParts.length == 1) {
    return (obj as any)[keyParts[0]];
  }
  const currentKey: string = keyParts.shift() as string;
  return getValueFromInnerProperty((obj as any)[currentKey], keyParts.join('.'));
}

export function isCustomKey(keyList: any, value: string): boolean {
  for (const key in keyList) {
    if (keyList[key] === value) return false;
  }
  return true;
}

export function getActorKeyForProficiency(proficiencyKey: string, proficiencyValue: string): string {
  let actorKey = 'data.traits.';
  if (Array.isArray(proficiencyValue) && proficiencyValue.length == 1) {
    proficiencyValue = proficiencyValue[0];
  }
  switch (proficiencyKey) {
    case 'skills':
      actorKey = 'data.skills.$VALUE$.value';
      break;
    case 'weapons':
      actorKey += isCustomKey(WeaponType, proficiencyValue) ? 'weaponProf.custom' : 'weaponProf.value';
      break;
    case 'armor':
      break;
    case 'tools':
      break;
  }
  return actorKey;
}

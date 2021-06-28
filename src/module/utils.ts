export async function getItemFromCompendiumByName(compendiumName: string, itemName: string) {
  // const compendium = await game.packs.get(compendiumName).getDocuments();
  // return await compendium?.find((r: any) => r.data.name == itemName);

  const pack = game.packs.get(compendiumName);
  const index = (pack as any).index.getName(itemName);
  const item = await (pack as any).getDocument(index._id);
  return (game as any).items.fromCompendium(item);
}

export function getAbilityNameByKey(key: string) {
  return key === 'any' ? game.i18n.localize(`HCT.Common.ANY`) : game.i18n.localize(`DND5E.Ability${key.capitalize()}`);
}

export function modifierSign(val: number) {
  return val >= 0 ? `+${val}` : `-${val}`;
}

export function openTab(id: string): void {
  $('.tab-body').hide();
  $('.tablinks').removeClass('active');
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

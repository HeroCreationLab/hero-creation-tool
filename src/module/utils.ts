// Class for utilitarian functions used in multiple places

let raceCompendium: any;

// TODO check if still necessary
export async function getItemFromCompendiumByName(compendiumName: string, itemName: string) {
  const compendium = await game.packs.get(compendiumName).getDocuments();
  return compendium?.find((r: any) => r.data.name == itemName);
}

export async function getItemFromRaceCompendiumByName(itemName: string) {
  raceCompendium = raceCompendium ? raceCompendium : await game.packs.get('dnd5e.races').getDocuments();
  return raceCompendium?.find((r: any) => r.data.name == itemName);
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

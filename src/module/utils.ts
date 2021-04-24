import * as Constants from './constants';

// Class for utilitarian functions used in multiple places
export function getItemFromCompendiumByName(compendium: Entity<Entity.Data>[], name: string) {
  return compendium.find((r: any) => r.data.name == name);
}

export function getAbilityNameByKey(key: string) {
  return key === 'any' ? game.i18n.localize(`HCT.Common.Abilities.ANY`) : game.i18n.localize(`DND5E.Ability${key}`);
}

export async function stackNotification(message: string) {
  // idea on the brewing.. as only 3 notifications can be shown at the time
  // and they expire every 3 seconds, it would be nice to post the notifications
  // staggered every second and a half so they flow nicely
}

export function openTab(id: string): void {
  $('.tab-body').hide();
  $('.tablinks').removeClass('active');
  $(`#${id}`).show();
}

export function openSelector(evt: Event): void {
  const selector = $('#equip-select') as any;
  const selectedValue = selector.selectedIndex;

  if (selectedValue == 2) {
    $('#class-equip').css('display', 'none');
    $('#gold-equip').css('display', 'inline-block');
  } else if (selectedValue == 1) {
    $('#class-equip').css('display', 'inline-block');
    $('#gold-equip').css('display', 'none');
  } else {
    $('#class-equip').css('display', 'none');
    $('#gold-equip').css('display', 'none');
  }
}

/*
  Important note: PLEASE INCLUDE "modules/hero-creation-tool/..." to your relative path since we are using foundry as the main file path.
  Returns a promis with the json object as its value.
  Input: path, string
  Return data, promise

  Guide to promises:
  For those who do not know how to access said value from the promise I will right an example code

  let json = getJson("modules/hero-creation-tool/scripts/database/class-jsons/index.json"); //calls the function, json is now a promise
  json //to access the value you can use this quick notation .then (data =>) will assign the value to data where you can use it
  .then(data =>{
      // here data is the Json object for the index.json
      populateList("class-dropdown", data, true, 'class.'); //here I am calling the populateList() passing through data to populate the dropdown list with id="class-dropdown"
  })
  */
export async function getJson(path: string) {
  // TODO maybe use Constants.MODULE_PATH instead of the note on the comment on top ?
  // also, this should probably be private (not exported) and having specific getDatabaseJson() and any other specific we might need
  console.log(Constants.MODULE_PATH);
  const response = await fetch(path);
  return await response.json();
}

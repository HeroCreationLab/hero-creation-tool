import HeroOption from './options/HeroOption';
import MultiOption from './options/MultiOption';
import { StepEnum } from './Step';

export type OptionSettings = {
  step: StepEnum;
  $parent: JQuery;
  pushTo: HeroOption[];
  quantity: number;
  filteredOptions?: KeyValue[];
  addValues: boolean;
  expandable: boolean;
  customizable: boolean;
};

type KeyValue = {
  key: string;
  value: string;
};

export function prepareSkillOptions(optionSettings: OptionSettings): MultiOption {
  const foundrySkills = (game as any).dnd5e.config.skills;
  const skillChoices: KeyValue[] = Object.keys(foundrySkills).map((k) => ({ key: k, value: foundrySkills[k] }));
  return prepareOptions(
    optionSettings,
    'skills',
    optionSettings.filteredOptions ?? skillChoices,
    game.i18n.localize('HCT.Common.SkillProficiencies'),
  );
}

export function prepareLanguageOptions(optionSettings: OptionSettings): MultiOption {
  const foundryLanguages = (game as any).dnd5e.config.languages;
  const langChoices: KeyValue[] = Object.keys(foundryLanguages).map((k) => ({ key: k, value: foundryLanguages[k] }));
  return prepareOptions(
    optionSettings,
    'languages',
    optionSettings.filteredOptions ?? langChoices,
    game.i18n.localize('HCT.Common.LanguageProficiencies'),
  );
}

export function prepareToolOptions(optionSettings: OptionSettings): MultiOption {
  const foundryToolTypes = (game as any).dnd5e.config.toolProficiencies;
  const foundryTools = (game as any).dnd5e.config.toolIds;
  const toolTypeChoices: KeyValue[] = Object.keys(foundryToolTypes).map((k) => ({
    key: k,
    value: `All ${foundryToolTypes[k]}`,
  }));
  const toolChoices: KeyValue[] = Object.keys(foundryTools).map((k) => ({ key: k, value: k.capitalize() }));
  return prepareOptions(
    optionSettings,
    'toolProf',
    optionSettings.filteredOptions ?? [...toolTypeChoices, ...toolChoices],
    game.i18n.localize('DND5E.TraitToolProf'),
  );
}

export function prepareWeaponOptions(optionSettings: OptionSettings): MultiOption {
  const foundryWeaponTypes = (game as any).dnd5e.config.weaponProficiencies;
  const foundryWeapons = (game as any).dnd5e.config.weaponIds;
  // const pack = getItemsPack();
  // for (let weaponId in foundryWeapons) {
  //   const item = await pack.getDocument(foundryWeapons[weaponId]);
  //   let weaponType = item?.data.data.weaponType;

  //  }
  const weaponTypeChoices: KeyValue[] = Object.keys(foundryWeaponTypes).map((k) => ({
    key: k,
    value: `All ${foundryWeaponTypes[k]}`,
  }));
  const weaponChoices: KeyValue[] = Object.keys(foundryWeapons).map((k) => ({ key: k, value: k.capitalize() }));
  return prepareOptions(
    optionSettings,
    'weaponProf',
    optionSettings.filteredOptions ?? [...weaponTypeChoices, ...weaponChoices],
    game.i18n.localize('DND5E.TraitWeaponProf'),
  );
}

export function prepareArmorOptions(optionSettings: OptionSettings): MultiOption {
  const foundryArmorTypes = (game as any).dnd5e.config.armorProficiencies;
  const foundryArmor = (game as any).dnd5e.config.armorIds;
  const armorTypeChoices: KeyValue[] = Object.keys(foundryArmorTypes).map((k) => ({
    key: k,
    value: `All ${foundryArmorTypes[k]}`,
  }));
  const foundryArmorChoices: KeyValue[] = Object.keys(foundryArmor).map((k) => ({ key: k, value: k.capitalize() }));
  return prepareOptions(
    optionSettings,
    'armorProf',
    optionSettings.filteredOptions ?? [...armorTypeChoices, ...foundryArmorChoices],
    game.i18n.localize('DND5E.TraitArmorProf'),
  );
}

export function prepareOptions(
  optionSettings: OptionSettings,
  key: string,
  options: KeyValue[],
  containerLabel: string,
): MultiOption {
  const container = new MultiOption(optionSettings.step, key, options, optionSettings.quantity, containerLabel, {
    addValues: optionSettings.addValues,
    expandable: optionSettings.expandable,
    customizable: optionSettings.customizable,
  });
  //container.render(optionSettings.$parent);
  return container;
}

// function getItemsPack() {
//   const pack = game.packs.get("dnd5e.items");
//   if(!pack) {
//     throw new Error("Couldn't find items pack on dnd5e.items");
//   }
//   return pack;
// }

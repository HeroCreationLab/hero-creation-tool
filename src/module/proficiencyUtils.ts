import HeroOption from './options/HeroOption';
import MultiOption from './options/MultiOption';
import OptionsContainer from './options/OptionsContainer';
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

export function prepareSkillOptions(optionSettings: OptionSettings) {
  const foundrySkills = (game as any).dnd5e.config.skills;
  const skillChoices: KeyValue[] = Object.keys(foundrySkills).map((k) => ({ key: k, value: foundrySkills[k] }));
  prepareOptions(
    optionSettings,
    'skills',
    optionSettings.filteredOptions ?? skillChoices,
    game.i18n.localize('HCT.Common.SkillProficiencies'),
  );
}

export function prepareToolOptions(optionSettings: OptionSettings) {
  const foundryTools = (game as any).dnd5e.config.toolProficiencies;
  const toolChoices: KeyValue[] = Object.keys(foundryTools).map((k) => ({ key: k, value: foundryTools[k] }));
  prepareOptions(
    optionSettings,
    'toolProf',
    optionSettings.filteredOptions ?? toolChoices,
    game.i18n.localize('DND5E.TraitToolProf'),
  );
}

export function prepareLanguageOptions(optionSettings: OptionSettings) {
  const foundryLanguages = (game as any).dnd5e.config.languages;
  const langChoices: KeyValue[] = Object.keys(foundryLanguages).map((k) => ({ key: k, value: foundryLanguages[k] }));
  prepareOptions(
    optionSettings,
    'languages',
    optionSettings.filteredOptions ?? langChoices,
    game.i18n.localize('HCT.Common.LanguageProficiencies'),
  );
}

export function prepareWeaponOptions(optionSettings: OptionSettings) {
  const foundryWeapons = (game as any).dnd5e.config.weaponProficiencies;
  const weaponChoices: KeyValue[] = Object.keys(foundryWeapons).map((k) => ({ key: k, value: foundryWeapons[k] }));
  prepareOptions(
    optionSettings,
    'weaponProf',
    optionSettings.filteredOptions ?? weaponChoices,
    game.i18n.localize('DND5E.TraitWeaponProf'),
  );
}

export function prepareArmorOptions(optionSettings: OptionSettings) {
  const foundryArmor = (game as any).dnd5e.config.armorProficiencies;
  const armorChoices: KeyValue[] = Object.keys(foundryArmor).map((k) => ({ key: k, value: foundryArmor[k] }));
  prepareOptions(
    optionSettings,
    'armorProf',
    optionSettings.filteredOptions ?? armorChoices,
    game.i18n.localize('DND5E.TraitArmorProf'),
  );
}

export function prepareOptions(
  optionSettings: OptionSettings,
  key: string,
  options: KeyValue[],
  containerLabel: string,
) {
  const container = new OptionsContainer(containerLabel, [
    new MultiOption(optionSettings.step, key, options, optionSettings.quantity, ' ', {
      addValues: optionSettings.addValues,
      expandable: optionSettings.expandable,
      customizable: optionSettings.customizable,
    }),
  ]);
  container.render(optionSettings.$parent);
  optionSettings.pushTo.push(...container.options);
}

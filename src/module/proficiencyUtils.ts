import { ProficiencyChoicesType } from './dnd5e';
import HeroOption from './options/heroOption';
import MultiOption from './options/multiOption';
import { StepEnum } from './step';
import { getLocalizedAbility } from './utils';

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
  value: any;
};

export function prepareSkillOptions(optionSettings: OptionSettings): MultiOption {
  const foundrySkills = (game as any).dnd5e.config.skills;
  const skillChoices: KeyValue[] = Object.keys(foundrySkills).map((k) => ({
    key: k,
    value: `${foundrySkills[k].label} (${getLocalizedAbility(foundrySkills[k].ability)})`,
  }));
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

export async function prepareToolOptions(optionSettings: OptionSettings) {
  const toolChoices = await (game as any).dnd5e.documents.Trait.choices('tool');

  return prepareOptions(
    optionSettings,
    'toolProf',
    optionSettings.filteredOptions ?? toKeyValues(toolChoices),
    game.i18n.localize('HCT.Common.ToolProficiencies'),
  );
}

export async function prepareWeaponOptions(optionSettings: OptionSettings) {
  const weaponChoices = await (game as any).dnd5e.documents.Trait.choices('weapon');

  return prepareOptions(
    optionSettings,
    'weaponProf',
    optionSettings.filteredOptions ?? toKeyValues(weaponChoices),
    game.i18n.localize('HCT.Common.WeaponProficiencies'),
  );
}

export async function prepareArmorOptions(optionSettings: OptionSettings) {
  const armorChoices = await (game as any).dnd5e.documents.Trait.choices('armor');

  return prepareOptions(
    optionSettings,
    'armorProf',
    optionSettings.filteredOptions ?? toKeyValues(armorChoices),
    game.i18n.localize('HCT.Common.ArmorProficiencies'),
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
  return container;
}

const toKeyValues = (prof?: ProficiencyChoicesType): KeyValue[] => {
  if (!prof) return [];

  const parentTypes = Object.keys(prof).map((p) => ({ key: p, value: prof[p].label }));
  const childrenTypes = Object.values(prof).flatMap((p) => {
    if (!p.children) return [];
    return Object.keys(p.children).flatMap((ck) => {
      return { key: ck, value: p.children![ck].label };
    });
  });
  return [...parentTypes, ...childrenTypes];
};

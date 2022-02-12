declare class TraitSelectorType extends DocumentSheet {}

declare class ProficiencySelector extends TraitSelectorType {
  static getChoices(type: 'armor' | 'weapon' | 'tool'): Promise<ProficiencyChoicesType>;
}

export type ProficiencySelectorClass = typeof ProficiencySelector;

type ProficiencyChoicesType = {
  [key: string]: {
    label: string;
    children?: ProficiencyChoicesChildren;
  };
};

export type ProficiencyChoicesChildren = {
  [key: string]: {
    label: string;
  };
};

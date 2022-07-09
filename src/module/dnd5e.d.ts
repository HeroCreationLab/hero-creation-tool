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

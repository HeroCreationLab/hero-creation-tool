export type AdvancementEntry = {
  _id: string;
  icon: string;
  type: string;
  title: string;
};

export type AbilityScoreAdvancementEntry = AdvancementEntry & {
  type: 'AbilityScoreImprovement';
  level: number;
  configuration: {
    cap: number;
    points: number;
    fixed: {
      str: number;
      dex: number;
      con: number;
      int: number;
      wis: number;
      cha: number;
    };
  };
};

export type HitPointsAdvancementEntry = AdvancementEntry & {
  type: 'HitPoints';
};

export type ItemGrantAdvancementEntry = AdvancementEntry & {
  type: 'ItemGrant';
  level: number;
  configuration: {
    items: string[];
  };
};

export type ScaleValueAdvancementEntry = AdvancementEntry & {
  type: 'ScaleValue';
  title: string;
  configuration: {
    identifier: string;
    type: string;
    scale: { [key: number]: { value: number } };
  };
};

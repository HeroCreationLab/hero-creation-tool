import { AdvancementType } from '../../advancements/advancementType';

export type AdvancementEntry = {
  _id: string;
  icon: string;
  type: string;
  title: string;
};

export type AbilityScoreAdvancementEntry = AdvancementEntry & {
  type: AdvancementType.ABILITY_SCORE_IMPROVEMENT;
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
  type: AdvancementType.HIT_POINTS;
};

export type ItemGrantAdvancementEntry = AdvancementEntry & {
  type: AdvancementType.ITEM_GRANT;
  level: number;
  configuration: {
    items: string[];
  };
};

export type ScaleValueAdvancementEntry = AdvancementEntry & {
  type: AdvancementType.SCALE_VALUE;
  title: string;
  configuration: {
    identifier: string;
    type: string;
    scale: { [key: number]: { value: number } };
  };
};

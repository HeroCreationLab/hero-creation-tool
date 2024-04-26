import { AdvancementType } from '../../advancements/advancementType';
import { DND5E } from '../../system.utils';

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

export type SizeAdvancementEntry = AdvancementEntry & {
  type: AdvancementType.SIZE;
  configuration: {
    hint?: string;
    sizes: [keyof typeof DND5E.SIZES];
  };
};

export type TraitAdvancementEntry = AdvancementEntry & {
  type: AdvancementType.TRAIT;
  configuration: {
    allowReplacements: boolean;
    choices: { count: number; pool: Set<string> }[];
    grants: Set<string>;
    hint?: string;
    mode: 'default'; // gain trait or proficiency
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

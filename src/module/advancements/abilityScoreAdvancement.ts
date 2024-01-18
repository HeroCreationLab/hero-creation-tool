import { Advancement } from './advancement';
import { AdvancementType } from './advancementType';

export interface AbilityScoreAdvancement extends Advancement {
  type: AdvancementType.ABILITY_SCORE_IMPROVEMENT;
  configuration: {
    cap: number;
    points: number;
    fixed?: {
      str: number;
      dex: number;
      con: number;
      int: number;
      wis: number;
      cha: number;
    };
  };
  value: {
    type: 'asi' | 'feat';
    feat: undefined;
    assignments: {
      str?: number;
      dex?: number;
      con?: number;
      int?: number;
      wis?: number;
      cha?: number;
    };
  };
}

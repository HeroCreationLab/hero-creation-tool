import { Advancement } from './advancement';
import { AdvancementType } from './advancementType';

export interface HitPointsAdvancement extends Advancement {
  type: AdvancementType.HIT_POINTS;
  hitDie: string;
  hitDieValue: number;
}

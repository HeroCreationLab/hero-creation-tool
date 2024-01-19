import { AdvancementType } from './advancementType';
import { Advancement } from './advancement';

export interface HitPointsAdvancement extends Advancement {
  type: AdvancementType.HIT_POINTS;
  hitDie: string;
  hitDieValue: number;
}

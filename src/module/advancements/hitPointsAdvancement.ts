import { HitPointsAdvancementEntry } from '../indexes/entries/advancementEntry';
import { AdvancementType } from './advancementType';

export interface HitPointsAdvancement extends HitPointsAdvancementEntry {
  type: AdvancementType.HIT_POINTS;
  hitDie: string;
  hitDieValue: number;
}

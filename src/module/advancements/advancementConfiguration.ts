import { ScaleValueAdvancement } from './scaleValueAdvancement';
import { ItemGrantAdvancement } from './itemGrantAdvancement';
import { HitPointsAdvancement } from './hitPointsAdvancement';
import { Advancement } from './advancement';

export interface AdvancementConfiguration {
  byId: {
    [id: string]: Advancement;
  };
  byLevel: {
    [lv: number]: Advancement[];
  };
  byType: {
    HitPoints: HitPointsAdvancement[];
    ItemGrant: ItemGrantAdvancement[];
    ScaleValue: ScaleValueAdvancement[];
  };
}

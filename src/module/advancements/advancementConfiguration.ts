import { ScaleValueAdvancement } from './ScaleValueAdvancement';
import { ItemGrantAdvancement } from './ItemGrantAdvancement';
import { HitPointsAdvancement } from './HitPointsAdvancement';
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

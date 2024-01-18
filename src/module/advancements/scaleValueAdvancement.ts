import { Advancement } from './advancement';
import { AdvancementType } from './advancementType';

export interface ScaleValueAdvancement extends Advancement {
  type: AdvancementType.SCALE_VALUE;
  identifier: string;
  data: {
    configuration: {
      identifier: string;
      type: 'number';
      scale: {
        [lv: number]: { value: number };
      };
    };
  };
}

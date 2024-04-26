import { ScaleValueAdvancementEntry } from '../indexes/entries/advancementEntry';
import { AdvancementType } from './advancementType';

export interface ScaleValueAdvancement extends ScaleValueAdvancementEntry {
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

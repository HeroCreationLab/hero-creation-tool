import { DND5E } from '../system.utils';
import { AdvancementType } from './advancementType';
import { Advancement } from './advancement';

export interface SizeAdvancement extends Advancement {
  type: AdvancementType.SIZE;
  configuration: {
    hint?: string;
    sizes: Set<keyof typeof DND5E.SIZES>;
  };
  value: {
    size: keyof typeof DND5E.SIZES;
  };
}

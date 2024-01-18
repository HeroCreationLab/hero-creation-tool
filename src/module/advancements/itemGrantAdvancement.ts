import { Advancement } from './advancement';
import { AdvancementType } from './advancementType';

export interface ItemGrantAdvancement extends Advancement {
  type: AdvancementType.ITEM_GRANT;
  data: {
    configuration: {
      items: string[];
    };
  };
}

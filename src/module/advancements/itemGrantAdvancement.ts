import { AdvancementType } from './advancementType';
import { Advancement } from './advancement';

export interface ItemGrantAdvancement extends Advancement {
  type: AdvancementType.ITEM_GRANT;
  data: {
    configuration: {
      items: string[];
    };
  };
}

import { ItemGrantAdvancementEntry } from '../indexes/entries/advancementEntry';
import { AdvancementType } from './advancementType';

export interface ItemGrantAdvancement extends ItemGrantAdvancementEntry {
  type: AdvancementType.ITEM_GRANT;
  data: {
    configuration: {
      items: string[];
    };
  };
}

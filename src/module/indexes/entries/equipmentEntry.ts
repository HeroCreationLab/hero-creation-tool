import { IndexEntry } from './indexEntry';

export type EquipmentEntry = IndexEntry & {
  system: {
    price: { value: number; denomination: string };
    rarity: string;
    quantity?: number;
  };
};

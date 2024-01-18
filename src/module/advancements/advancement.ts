import { AdvancementType } from './advancementType';

export interface Advancement {
  id: string;
  title: string;
  icon: string;
  levels: number[];
  type: AdvancementType;
}

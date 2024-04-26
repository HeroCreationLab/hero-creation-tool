import { AbilityScoreAdvancementEntry } from '../indexes/entries/advancementEntry';

export interface AbilityScoreAdvancement extends AbilityScoreAdvancementEntry {
  value: {
    type: 'asi' | 'feat';
    feat: undefined;
    assignments: {
      str?: number;
      dex?: number;
      con?: number;
      int?: number;
      wis?: number;
      cha?: number;
    };
  };
}

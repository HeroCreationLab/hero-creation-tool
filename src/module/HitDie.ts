import * as Utils from './utils';
import SettingKeys from './settings';
import { HpCalculation } from './constants';
import { ClassLevel } from './ClassLevel';

export class HitDie {
  constructor(private hd: string) {}

  getVal() {
    return `1${this.hd}`;
  }

  getMax(): number {
    return parseInt(this.hd.substring(1));
  }

  getAvg(): number {
    const half = Math.ceil(this.getMax() / 2);
    return half + 1;
  }

  async calculateHpAtLevel(level: ClassLevel, method: HpCalculation, conMod: number) {
    const firstLevelHp = this.getMax() + conMod;
    if (level === 1) return firstLevelHp;

    let higherLevelHp = 0;
    if (method === 'avg') {
      higherLevelHp = (this.getAvg() + conMod) * (level - 1);
    } else {
      // roll
      for (let l = 2; l <= level; l++) {
        const roll = await new Roll(`${this.getVal()} + ${conMod}`).evaluate({ async: true });
        if (Utils.getModuleSetting(SettingKeys.SHOW_ROLLS_AS_MESSAGES)) {
          roll.toMessage({ flavor: game.i18n.format('HCT.Class.HpRollChatFlavor', { lv: l }) });
        }
        higherLevelHp += parseInt(roll.result) + conMod;
      }
    }
    return firstLevelHp + higherLevelHp;
  }
}

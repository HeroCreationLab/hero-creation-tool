import * as Constants from './constants';
import { Settings } from './settings';

export default class HeroData {
  name?: string;
  type?: string;
  img?: string;
  folder?: any;
  sort?: number;
  data?: {
    abilities?: {
      str?: { value: number };
      dex?: { value: number };
      con?: { value: number };
      int?: { value: number };
      wis?: { value: number };
      cha?: { value: number };
    };
    details?: {
      appearance?: string;
      biography?: {
        value: string;
      };
    };
    attributes: {
      hp: {
        value: number;
        max: number;
      };
    };
    skills: {
      acr: { value: number };
      ani: { value: number };
      arc: { value: number };
      ath: { value: number };
      dec: { value: number };
      his: { value: number };
      ins: { value: number };
      inv: { value: number };
      itm: { value: number };
      med: { value: number };
      nat: { value: number };
      per: { value: number };
      prc: { value: number };
      prf: { value: number };
      rel: { value: number };
      slt: { value: number };
      ste: { value: number };
      sur: { value: number };
    };
  };
  token?: any;
  items?: Array<any>;
  flags?: any;

  constructor() {
    const displayBarsSetting = game.settings.get(Constants.MODULE_NAME, Settings.TOKEN_BAR);
    const displayNameSetting = game.settings.get(Constants.MODULE_NAME, Settings.TOKEN_NAME);

    this.type = 'character';
    this.img = Constants.MYSTERY_MAN;
    this.folder = null;
    this.sort = 12000;
    this.token = {
      actorLink: true,
      disposition: 1,
      img: Constants.MYSTERY_MAN,
      vision: true,
      dimSight: 0,
      bar1: { attribute: 'attributes.hp' },
      displayBars: Number.parseInt(displayBarsSetting),
      displayName: Number.parseInt(displayNameSetting),
    };
    this.data = {
      abilities: {
        str: { value: 0 },
        dex: { value: 0 },
        con: { value: 0 },
        int: { value: 0 },
        wis: { value: 0 },
        cha: { value: 0 },
      },
      attributes: {
        hp: {
          value: 0,
          max: 0,
        },
      },
      skills: {
        acr: { value: 0 },
        ani: { value: 0 },
        arc: { value: 0 },
        ath: { value: 0 },
        dec: { value: 0 },
        his: { value: 0 },
        ins: { value: 0 },
        inv: { value: 0 },
        itm: { value: 0 },
        med: { value: 0 },
        nat: { value: 0 },
        per: { value: 0 },
        prc: { value: 0 },
        prf: { value: 0 },
        rel: { value: 0 },
        slt: { value: 0 },
        ste: { value: 0 },
        sur: { value: 0 },
      },
    };
  }
}

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
    };
  }
}

import * as Constants from './constants';

export default class HeroData {
  name?: string;
  type: string;
  img: string;
  folder: any;
  sort: number;
  data: {
    abilities: {
      str: { value: number };
      dex: { value: number };
      con: { value: number };
      int: { value: number };
      wis: { value: number };
      cha: { value: number };
    };
    details?: {
      appearance?: string;
      biography?: {
        value: string;
      };
    };
  };
  token?: any;
  items?: any;
  flags?: any;

  constructor() {
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
      displayBars: 20, //game.settings.get('hero-creation-tool', 'displayBarsMode'),
      displayName: 20, //game.settings.get('hero-creation-tool', 'displayNameMode'),
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
    };
  }
}

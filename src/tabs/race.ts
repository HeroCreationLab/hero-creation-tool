/*
  Functions used exclusively on the Race tab
*/
import HeroData from '../types/ActorData.js'
import { Utils } from '../utils.js'
import Race, { Size } from '../types/Race.js';

export namespace RaceTab {
  export function setListeners() {
    // example on using types
    const elf = new Race('Elf');
    elf.size = Size.Medium;
    Utils.log(elf);
  }

  export function savaData(newActor: HeroData) {
    Utils.log('Saving Race Tab data into actor');

    // TBD
  }
}

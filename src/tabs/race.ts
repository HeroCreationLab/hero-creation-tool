/*
  Functions used exclusively on the Race tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import Race, { Size } from '../types/Race.js';

export namespace RaceTab {
  export function setListeners() {
    // example on using types
    const elf = new Race('Elf');
    elf.size = Size.Medium;
    console.log(`${Constants.LOG_PREFIX} |`, elf);
  }

  export function savaData(newActor: HeroData) {
    console.log(`${Constants.LOG_PREFIX} | Saving Race Tab data into actor`);

    // TBD
  }
}

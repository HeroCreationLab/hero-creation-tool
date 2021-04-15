/*
  Functions used exclusively on the Class tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'

export namespace ClassTab {
  export function setListeners() { }

  export function saveData(newActor: HeroData) {
    console.log(`${Constants.LOG_PREFIX} | Saving Class Tab data into actor`);

    // TBD
  }
}
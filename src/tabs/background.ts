/*
  Functions used exclusively on the Background tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'

export namespace BackgroundTab {
  export function setListeners() { }

  export function saveData(newActor: HeroData) {
    console.log(`${Constants.LOG_PREFIX} | Saving Background Tab data into actor`);

    // TBD
  }
}
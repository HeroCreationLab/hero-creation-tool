/*
  Functions used exclusively on the Equipment tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'

export namespace EquipmentTab {
  export function setListeners() { }

  export function saveData(newActor: HeroData) {
    console.log(`${Constants.LOG_PREFIX} | Saving Equipment Tab data into actor`);

    // TBD
  }
}
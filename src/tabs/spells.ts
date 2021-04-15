/*
  Functions used exclusively on the Spells tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'

export namespace SpellsTab {
  export function setListeners() { }

  export function saveData(newActor: HeroData) {
    console.log(`${Constants.LOG_PREFIX} | Saving Spells Tab data into actor}`);

    // TBD
  }
}
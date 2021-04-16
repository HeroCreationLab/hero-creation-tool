/*
  Functions used exclusively on the Spells tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { Tab } from './Tab.js';

class _Spells implements Tab {
  setListeners(): void { }

  saveData(newActor: HeroData): boolean {
    console.log(`${Constants.LOG_PREFIX} | Saving Spells Tab data into actor}`);

    // TBD
    return true;
  }
}
const SpellsTab: Tab = new _Spells();
export default SpellsTab;

/*
  Functions used exclusively on the Equipment tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { Tab } from './Tab.js';

class _Equipment implements Tab {
  setListeners(): void { }

  saveData(newActor: HeroData): boolean {
    console.log(`${Constants.LOG_PREFIX} | Saving Equipment Tab data into actor`);

    // TBD
    return true;
  }
}
const EquipmentTab: Tab = new _Equipment();
export default EquipmentTab;

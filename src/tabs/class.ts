/*
  Functions used exclusively on the Class tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js';
import { Tab } from './Tab.js';

class _Class implements Tab {
  setListeners(): void { }

  saveData(newActor: HeroData): boolean {
    console.log(`${Constants.LOG_PREFIX} | Saving Class Tab data into actor`);

    // TBD
    return true;
  }
}
const ClassTab: Tab = new _Class();
export default ClassTab;

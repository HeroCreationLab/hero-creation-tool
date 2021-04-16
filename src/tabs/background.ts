/*
  Functions used exclusively on the Background tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { Tab } from './Tab.js';

class _BackgroundTab implements Tab {
  setListeners(): void { }

  saveData(newActor: HeroData): boolean {
    console.log(`${Constants.LOG_PREFIX} | Saving Background Tab data into actor`);

    // TBD
    return true;
  }
}
const BackgroundTab: Tab = new _BackgroundTab();
export default BackgroundTab;

/*
  Functions used exclusively on the Review tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { Tab } from './Tab.js';

class _Review implements Tab {
  setListeners(): void { }

  saveData(newActor: HeroData): boolean {
    return true; // ReviewTab doesn't save any data
  }
}
const ReviewTab: Tab = new _Review();
export default ReviewTab;

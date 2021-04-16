/*
  Functions used exclusively on the Race tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { Tab } from './Tab.js';
import Race, { Size } from '../types/Race.js';

class _Race implements Tab {
  setListeners(): void {
    // example on using types
    const elf = new Race('Elf');
    elf.size = Size.Medium;
    console.log(`${Constants.LOG_PREFIX} |`, elf);
  }

  saveData(newActor: HeroData): boolean {
    console.log(`${Constants.LOG_PREFIX} | Saving Race Tab data into actor`);

    // TBD
    return true;
  }
}
const RaceTab: Tab = new _Race();
export default RaceTab;

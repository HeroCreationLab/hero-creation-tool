/*
  Functions used exclusively on the Biography tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { Tab } from './Tab.js';

class _Bio implements Tab {
  setListeners(): void { }

  saveData(newActor: HeroData): boolean {
    console.log(`${Constants.LOG_PREFIX} | Saving Biography Tab data into actor`);

    let appearance = "";
    appearance = appearance.concat(`Age: ${$("#character_age").val()}`)
    appearance = appearance.concat(`\nHeight: ${$("#character_height").val()}`)
    appearance = appearance.concat(`\nWeight: ${$("#character_weight").val()}`)
    appearance = appearance.concat(`\nEyes: ${$("#character_eye_color").val()} ${$("#character_eye_rgb").val()}`)
    appearance = appearance.concat(`\nHair: ${$("#character_hair_color").val()} ${$("#character_hair_rgb").val()}`)
    appearance = appearance.concat(`\nSkin: ${$("#character_skin_color").val()} ${$("#character_skin_rgb").val()}`)

    newActor.data.details = {
      appearance: appearance,
      biography: { value: $("#character_biography").val() as string },
    }
    return true;
  }
}
const BioTab: Tab = new _Bio();
export default BioTab;

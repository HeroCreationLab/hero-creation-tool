/*
    Functions used exclusively on the Biography tab
*/
import HeroData from '../types/ActorData';
import * as Constants from '../constants';
import { DataError } from '../types/DataError';
import { Step, StepEnum } from '../types/Step';

class _Bio extends Step {
  constructor() {
    super(StepEnum.Biography);
  }

  setListeners(): void {
    /*TBD*/
  }

  setSourceData(): void {
    /*TBD*/
  }

  renderData(): void {
    /*TBD*/
  }

  getErrors(): DataError[] {
    const errors: DataError[] = [];
    if (false) {
      errors.push(this.error('HCT.Err.Key'));
    }
    return errors;
  }

  saveActorData(newActor: HeroData): void {
    console.log(`${Constants.LOG_PREFIX} | Saving Biography Tab data into actor`);

    const appearance = `Age: ${$('#character_age').val()}
		Height: ${$('#character_height').val()}
		Weight: ${$('#character_weight').val()}
		Eyes: ${$('#character_eye_color').val()} ${$('#character_eye_rgb').val()}
		Hair: ${$('#character_hair_color').val()} ${$('#character_hair_rgb').val()}
		Skin: ${$('#character_skin_color').val()} ${$('#character_skin_rgb').val()}
		`;
    (newActor.data as any).details = {
      appearance: appearance,
      biography: { value: $('#character_biography').val() as string },
    };
  }
}
const BioTab: Step = new _Bio();
export default BioTab;

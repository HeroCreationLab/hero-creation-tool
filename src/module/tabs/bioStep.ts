/*
    Functions used exclusively on the Biography tab
*/
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import * as Constants from '../constants';
import { Step, StepEnum } from '../Step';

class _Bio extends Step {
  constructor() {
    super(StepEnum.Biography);
  }

  section = () => $('#bioDiv');

  setListeners(): void {
    /* IMPLEMENT AS NEEDED */
  }

  setSourceData(): void {
    /* IMPLEMENT AS NEEDED */
  }

  renderData(): void {
    /* IMPLEMENT AS NEEDED */
  }

  /**
   * @deprecated
   */
  // TODO convert to HeroOptions
  getHeroOptions(newActor: ActorDataConstructorData): void {
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

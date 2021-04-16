/*
		Functions used exclusively on the Biography tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataTab } from '../types/DataTab.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Bio extends Step implements DataTab {
	setListeners(): void { }

	getErrors(): DataError[] {
		const errors: DataError[] = [];
		if (false) {
			errors.push(this.error("HCT.Err.Key"));
		}
		return errors;
	}

	saveData(newActor: HeroData): void {
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
	}
}
const BioTab: DataTab = new _Bio(StepEnum.Biography);
export default BioTab;

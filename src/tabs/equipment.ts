/*
  Functions used exclusively on the Equipment tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Equipment extends Step {
	constructor() {
		super(StepEnum.Equipment)
	}

	setListeners(): void { }

	setSourceData(): void {
		//
	}

	renderData(): void {
		// to be implemented
	}

	getErrors(): DataError[] {
		const errors: DataError[] = [];
		if (false) {
			errors.push(this.error("HCT.Err.Key"));
		}
		return errors;
	}

	saveActorData(newActor: HeroData): void {
		console.log(`${Constants.LOG_PREFIX} | Saving Equipment Tab data into actor`);

		// TBD
	}
}
const EquipmentTab: Step = new _Equipment();
export default EquipmentTab;

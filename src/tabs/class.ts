/*
  Functions used exclusively on the Class tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Class extends Step {
	constructor() {
		super(StepEnum.Class)
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
		console.log(`${Constants.LOG_PREFIX} | Saving Class Tab data into actor`);

		// TBD
	}
}
const ClassTab: Step = new _Class();
export default ClassTab;

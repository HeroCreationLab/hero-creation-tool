/*
  Functions used exclusively on the Background tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _BackgroundTab extends Step {
	constructor() {
		super(StepEnum.Background)
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
		console.log(`${Constants.LOG_PREFIX} | Saving Background Tab data into actor`);

		// TBD
	}
}
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;

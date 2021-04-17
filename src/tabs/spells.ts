/*
  Functions used exclusively on the Spells tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Spells extends Step {
	constructor() {
		super(StepEnum.Spells)
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

	saveActorData(newActor: HeroData): boolean {
		console.log(`${Constants.LOG_PREFIX} | Saving Spells Tab data into actor}`);

		// TBD
		return true;
	}
}
const SpellsTab: Step = new _Spells();
export default SpellsTab;

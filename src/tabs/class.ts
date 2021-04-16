/*
  Functions used exclusively on the Class tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataTab } from '../types/DataTab.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Class extends Step implements DataTab {
	setListeners(): void { }

	getErrors(): DataError[] {
		const errors: DataError[] = [];
		if (false) {
			errors.push(this.error("HCT.Err.Key"));
		}
		return errors;
	}

	saveData(newActor: HeroData): void {
		console.log(`${Constants.LOG_PREFIX} | Saving Class Tab data into actor`);

		// TBD
	}
}
const ClassTab: DataTab = new _Class(StepEnum.Class);
export default ClassTab;

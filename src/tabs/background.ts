/*
  Functions used exclusively on the Background tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataTab } from '../types/DataTab.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _BackgroundTab extends Step implements DataTab {
	setListeners(): void { }

	getErrors(): DataError[] {
		const errors: DataError[] = [];
		if (false) {
			errors.push(this.error("HCT.Err.Key"));
		}
		return errors;
	}

	saveData(newActor: HeroData): void {
		console.log(`${Constants.LOG_PREFIX} | Saving Background Tab data into actor`);

		// TBD
	}
}
const BackgroundTab: DataTab = new _BackgroundTab(StepEnum.Background);
export default BackgroundTab;

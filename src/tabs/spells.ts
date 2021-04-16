/*
  Functions used exclusively on the Spells tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataTab } from '../types/DataTab.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Spells extends Step implements DataTab {
	setListeners(): void { }

	getErrors(): DataError[] {
		const errors: DataError[] = [];
		if (false) {
			errors.push(this.error("HCT.Err.Key"));
		}
		return errors;
	}

	saveData(newActor: HeroData): boolean {
		console.log(`${Constants.LOG_PREFIX} | Saving Spells Tab data into actor}`);

		// TBD
		return true;
	}
}
const SpellsTab: DataTab = new _Spells(StepEnum.Spells);
export default SpellsTab;

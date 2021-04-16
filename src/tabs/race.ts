/*
  Functions used exclusively on the Race tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataTab } from '../types/DataTab.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'
import Race, { Size } from '../types/Race.js'

class _Race extends Step implements DataTab {
	setListeners(): void {
		// example on using types
		const elf = new Race('Elf');
		elf.size = Size.Medium;
		console.log(`${Constants.LOG_PREFIX} |`, elf);
	}

	getErrors(): DataError[] {
		const errors: DataError[] = [];
		if (false) {
			errors.push(this.error("HCT.Err.Key"));
		}
		return errors;
	}

	saveData(newActor: HeroData): void {
		console.log(`${Constants.LOG_PREFIX} | Saving Race Tab data into actor`);

		// TBD
	}
}
const RaceTab: DataTab = new _Race(StepEnum.Race);
export default RaceTab;

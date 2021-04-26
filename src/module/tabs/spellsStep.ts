/*
  Functions used exclusively on the Spells tab
*/
import HeroData from '../types/ActorData';
import * as Constants from '../constants';
import { DataError } from '../types/DataError';
import { Step, StepEnum } from '../types/Step';

class _Spells extends Step {
  constructor() {
    super(StepEnum.Spells);
  }

  setListeners(): void {
    /*TBD*/
  }

  setSourceData(): void {
    /*TBD*/
  }

  renderData(): void {
    /*TBD*/
  }

  getErrors(): DataError[] {
    const errors: DataError[] = [];
    if (false) {
      errors.push(this.error('HCT.Err.Key'));
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

/*
  Functions used exclusively on the Class tab
*/
import HeroData from '../types/ActorData';
import * as Constants from '../constants';
import { DataError } from '../types/DataError';
import { Step, StepEnum } from '../types/Step';

class _Class extends Step {
  constructor() {
    super(StepEnum.Class);
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

  saveActorData(newActor: HeroData): void {
    console.log(`${Constants.LOG_PREFIX} | Saving Class Tab data into actor`);

    // TBD
  }
}
const ClassTab: Step = new _Class();
export default ClassTab;

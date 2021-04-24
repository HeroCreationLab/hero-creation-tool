/*
  Functions used exclusively on the Equipment tab
*/
import HeroData from '../types/ActorData';
import * as Constants from '../constants';
import { DataError } from '../types/DataError';
import { Step, StepEnum } from '../types/Step';

class _Equipment extends Step {
  constructor() {
    super(StepEnum.Equipment);
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
    console.log(`${Constants.LOG_PREFIX} | Saving Equipment Tab data into actor`);

    // TBD
  }
}
const EquipmentTab: Step = new _Equipment();
export default EquipmentTab;

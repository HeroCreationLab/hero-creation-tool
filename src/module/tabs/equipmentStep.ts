/*
  Functions used exclusively on the Equipment tab
*/
import { Step, StepEnum } from '../Step';

class _Equipment extends Step {
  constructor() {
    super(StepEnum.Equipment);
  }

  section = () => $('#eqDiv');

  setListeners(): void {
    /*TBD*/
  }

  setSourceData(): void {
    /*TBD*/
  }

  renderData(): void {
    /*TBD*/
  }
}
const EquipmentTab: Step = new _Equipment();
export default EquipmentTab;

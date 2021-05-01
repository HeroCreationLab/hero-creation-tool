/*
  Functions used exclusively on the Class tab
*/
import { Step, StepEnum } from '../Step';

class _Class extends Step {
  constructor() {
    super(StepEnum.Class);
  }

  section = () => $('#classDiv');

  setListeners(): void {
    /* IMPLEMENT AS NEEDED */
  }

  setSourceData(): void {
    /* IMPLEMENT AS NEEDED */
  }

  renderData(): void {
    /* IMPLEMENT AS NEEDED */
  }
}
const ClassTab: Step = new _Class();
export default ClassTab;

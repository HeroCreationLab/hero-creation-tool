/*
  Functions used exclusively on the Background tab
*/
import { Step, StepEnum } from '../Step';

class _BackgroundTab extends Step {
  constructor() {
    super(StepEnum.Background);
  }

  section = () => $('#backgroundDiv');

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
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;

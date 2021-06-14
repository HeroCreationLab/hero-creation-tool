/*
  Functions used exclusively on the Spells tab
*/
import { Step, StepEnum } from '../Step';

class _Spells extends Step {
  constructor() {
    super(StepEnum.Spells);
  }

  section = () => $('#spellsDiv');

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
const SpellsTab: Step = new _Spells();
export default SpellsTab;

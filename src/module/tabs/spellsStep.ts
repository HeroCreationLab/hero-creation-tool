import * as Utils from '../utils';
import * as Constants from '../constants';
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

  async renderData() {
    // Show rules on the side panel
    const spellsRulesItem = await Utils.getJournalFromPackByName(Constants.DEFAULT_PACKS.RULES, '10. Spellcasting');
    $('[data-hct_spells_description]', this.section()).html(TextEditor.enrichHTML((spellsRulesItem as any).content));
  }
}
const SpellsTab: Step = new _Spells();
export default SpellsTab;

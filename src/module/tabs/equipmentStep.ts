import * as Utils from '../utils';
import * as Constants from '../constants';
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

  async renderData() {
    // Show rules on the side panel
    const equipmentRulesItem = await Utils.getJournalFromPackByName(Constants.DEFAULT_PACKS.RULES, '05. Equipment');
    $('[data-hct_equipment_description]', this.section()).html(
      TextEditor.enrichHTML((equipmentRulesItem as any).content),
    );
  }
}
const EquipmentTab: Step = new _Equipment();
export default EquipmentTab;

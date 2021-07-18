/*
  Functions used exclusively on the Background tab
*/
import * as Utils from '../utils';
import * as Constants from '../constants';
import * as ProficiencyUtils from '../proficiencyUtils';
import { Step, StepEnum } from '../Step';
import InputOption from '../options/TextInputOption';
import SelectableOption from '../options/SelectableOption';
import CustomItemOption from '../options/CustomItemOption';

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

  async renderData() {
    // Show rules on the side panel
    const backgroundRulesItem = await Utils.getJournalFromPackByName(
      Constants.DEFAULT_PACKS.RULES,
      Constants.RULES.BACKGROUND,
    );
    $('[data-hct_background_description]', this.section()).html(
      TextEditor.enrichHTML((backgroundRulesItem as any).content),
    );

    this.setBackgroundNameUi();
    this.setAlignmentUi();

    const $proficienciesArea = $('[data-hct_area=proficiences]', this.section());
    ProficiencyUtils.prepareSkillOptions({
      step: this.step,
      $parent: $proficienciesArea,
      pushTo: this.stepOptions,
      quantity: 2,
      addValues: true,
      expandable: true,
      customizable: false,
    });
    ProficiencyUtils.prepareToolOptions({
      step: this.step,
      $parent: $proficienciesArea,
      pushTo: this.stepOptions,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    });
    ProficiencyUtils.prepareLanguageOptions({
      step: this.step,
      $parent: $proficienciesArea,
      pushTo: this.stepOptions,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    });

    this.setBackgroundFeatureUi();
  }

  private setBackgroundFeatureUi() {
    const $featureArea = $('[data-hct_area=feature]', this.section());
    const featureOption: CustomItemOption = new CustomItemOption(this.step, {
      type: 'feat',
      source: 'Background',
    });
    featureOption.render($featureArea);
    this.stepOptions.push(featureOption);
  }

  private setAlignmentUi() {
    const foundryAligments = (game as any).dnd5e.config.alignments;
    const alignmentChoices = Object.keys(foundryAligments).map((k) => ({
      key: foundryAligments[k],
      value: foundryAligments[k],
    }));
    const alignmentOption = new SelectableOption(this.step, 'data.details.alignment', alignmentChoices, '', {
      addValues: false,
    });
    alignmentOption.render($('[data-hct_area=alignment]', this.section()));
    this.stepOptions.push(alignmentOption);
  }

  private setBackgroundNameUi() {
    const nameOption = new InputOption(
      this.step,
      'data.details.background',
      game.i18n.localize('HCT.Background.NamePlaceholder'),
      '',
      { addValues: false, type: 'text' },
    );
    nameOption.render($('[data-hct_area=name]', this.section()));
    this.stepOptions.push(nameOption);
  }
}
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;

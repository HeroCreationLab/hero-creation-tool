/*
  Functions used exclusively on the Background tab
*/
import * as Utils from '../utils';
import * as Constants from '../constants';
import * as ProficiencyUtils from '../proficiencyUtils';
import { Step, StepEnum } from '../Step';
import SelectableOption from '../options/SelectableOption';
import SelectOrCustomItemOption from '../options/SelectOrCustomItemOption';
import { BackgroundFeatureEntry, getBackgroundFeatureEntries } from '../indexUtils';

class _BackgroundTab extends Step {
  constructor() {
    super(StepEnum.Background);
  }

  section = () => $('#backgroundDiv');

  backgroundFeatures!: BackgroundFeatureEntry[];

  async setSourceData() {
    this.backgroundFeatures = await getBackgroundFeatureEntries();
  }

  async renderData() {
    Utils.setPanelScrolls(this.section());
    // Show rules on the side panel
    const backgroundRulesItem = await Utils.getJournalFromDefaultRulesPack(game.i18n.localize('HCT.Background.RulesJournalName'));
    $('[data-hct_background_description]', this.section()).html(
      TextEditor.enrichHTML((backgroundRulesItem as any).content),
    );

    this.setBackgroundNameUi();
    this.setAlignmentUi();
    this.setProficienciesUi();
    this.setBackgroundFeatureUi();
  }

  private async setProficienciesUi() {
    const $proficienciesArea = $('[data-hct_area=proficiences]', this.section());
    const options = [];
    options.push(
      ProficiencyUtils.prepareSkillOptions({
        step: this.step,
        $parent: $proficienciesArea,
        pushTo: this.stepOptions,
        quantity: 2,
        addValues: true,
        expandable: true,
        customizable: false,
      }),
    );
    options.push(
      await ProficiencyUtils.prepareToolOptions({
        step: this.step,
        $parent: $proficienciesArea,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );
    options.push(
      ProficiencyUtils.prepareLanguageOptions({
        step: this.step,
        $parent: $proficienciesArea,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.forEach((o) => o.render($proficienciesArea));
    this.stepOptions.push(...options);
  }

  private setBackgroundFeatureUi() {
    const $featureArea = $('[data-hct_area=feature]', this.section());
    const customFeatureOption: SelectOrCustomItemOption = new SelectOrCustomItemOption(
      this.step,
      { type: 'feat', source: 'Background' },
      () => {
        // properties callback
        const $name = $('input', $('[data-hct_area=name]', this.section()));
        return { requirements: $name.val() };
      },
      this.backgroundFeatures,
      {
        addValues: true,
        allowNulls: true,
      },
    );
    customFeatureOption.render($featureArea);
    this.stepOptions.push(customFeatureOption);
  }

  private setAlignmentUi() {
    const foundryAligments = (game as any).dnd5e.config.alignments;
    const alignmentChoices = Object.keys(foundryAligments).map((k) => ({
      key: foundryAligments[k],
      value: foundryAligments[k],
    }));
    const alignmentOption = new SelectableOption(this.step, 'data.details.alignment', alignmentChoices, '', {
      addValues: false,
      customizable: false,
    });
    alignmentOption.render($('[data-hct_area=alignment]', this.section()));
    this.stepOptions.push(alignmentOption);
  }

  private setBackgroundNameUi() {
    const nameChoices = this.backgroundFeatures
      .filter(f => f.data.requirements)
      .map(f => ({ key: f.data.requirements, value: f.data.requirements }));
    const nameOption = new SelectableOption(
      StepEnum.Background,
      'data.details.background',
      nameChoices,
      '',
      { addValues: false, customizable: true },
      this.onBackgroundSelect,
      new Map(this.backgroundFeatures.map((obj) => [(obj.data as any).requirements, obj.name!])),
    );
    nameOption.render($('[data-hct_area=name]', this.section()));
    this.stepOptions.push(nameOption);
  }

  private onBackgroundSelect(backgroundFeatureName: string) {
    const $featureArea = $('[data-hct_area=feature]', $('#backgroundDiv'));
    const $select = $('select', $featureArea);
    const $img = $('img', $featureArea);
    const $name = $('input', $featureArea);
    const $desc = $('textarea', $featureArea);
    let isCustomTouched = false;
    if ($name.val() != '' || $desc.val() != '') isCustomTouched = true;

    if (!isCustomTouched) {
      if (backgroundFeatureName === 'custom') {
        $('option:selected', $select).prop('selected', false);
        $("option[value='']", $select).prop('selected', 'true');
        $img.attr('src', Constants.MYSTERY_MAN);
        return;
      }
      const value = $('option', $select)
        .filter(function () {
          return $(this).text() === backgroundFeatureName;
        })
        .first()
        .attr('value');
      if (value) {
        $select.val(value);
        $select.trigger('change');
      }
    }
  }
}
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;

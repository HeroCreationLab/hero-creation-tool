/*
  Functions used exclusively on the Background tab
*/
import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import { Step, StepEnum } from '../Step';
import SelectableOption from '../options/SelectableOption';
import {
  BackgroundFeatureEntry,
  getBackgroundFeatureEntries,
  getRuleJournalEntryByName,
  RuleEntry,
} from '../indexUtils';
import SelectableIndexEntryOption from '../options/SelectableIndexEntryOption';
import { MYSTERY_MAN } from '../constants';

class _BackgroundTab extends Step {
  constructor() {
    super(StepEnum.Background);
  }

  section = () => $('#backgroundDiv');

  backgroundFeatures!: BackgroundFeatureEntry[];
  backgroundRules?: RuleEntry;

  //TODO remove when Background items become a thing
  backgroundFeatureOption?: SelectableIndexEntryOption;

  async setSourceData() {
    this.backgroundFeatures = await getBackgroundFeatureEntries();
  }

  async renderData() {
    Utils.setPanelScrolls(this.section());
    // Show rules on the side panel
    const rulesCompendiumName = game.i18n.localize('HCT.Background.RulesJournalName');
    this.backgroundRules = await getRuleJournalEntryByName(rulesCompendiumName);
    if (this.backgroundRules) {
      $('[data-hct_background_description]', this.section()).html(TextEditor.enrichHTML(this.backgroundRules.content));
    } else {
      console.error(`Unable to find backgrounds' rule journal on compendium ${rulesCompendiumName}`);
    }

    this.setBackgroundNameUi();
    this.setAlignmentUi();
    this.setProficienciesUi();
    this.setBackgroundFeatureUi();
  }

  setListeners(): void {
    // TODO replace this to switch between showing Background rules vs Background desc when background items become a thing
    $('[data-hct-show-background-feature-desc]', this.section()).on('change', (ev) => {
      if ((ev.currentTarget as HTMLInputElement).checked) {
        // put  feature desc on the side
        const selectedBackgroundFeature = this.backgroundFeatureOption?.value() as
          | BackgroundFeatureEntry
          | null
          | undefined;
        const descToShow = selectedBackgroundFeature
          ? selectedBackgroundFeature.data.description.value
          : game.i18n.localize('HCT.Background.NoFeatureSelected');
        $('[data-hct_background_description]', this.section()).html(TextEditor.enrichHTML(descToShow));
      } else {
        // put Backgrounds rules on the side
        $('[data-hct_background_description]', this.section()).html(
          TextEditor.enrichHTML(this.backgroundRules?.content ?? ''),
        );
      }
    });
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
    this.backgroundFeatureOption = new SelectableIndexEntryOption(StepEnum.Class, 'items', this.backgroundFeatures, {
      addValues: true,
      placeholder: {
        name: game.i18n.localize('HCT.Common.SelectPlaceholder'),
        _id: '',
        _pack: '',
        type: 'feat',
        img: MYSTERY_MAN,
      },
    });
    this.backgroundFeatureOption.render($featureArea);
    this.stepOptions.push(this.backgroundFeatureOption);
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
      .filter((f) => f.data.requirements)
      .map((f) => ({ key: f.data.requirements, value: f.data.requirements }));
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
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;

/*
  Functions used exclusively on the Background tab
*/
import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import { Step, StepEnum } from '../step';
import SelectableOption from '../options/selectableOption';
import { BackgroundEntry, getBackgroundEntries, getRuleJournalEntryByName, RuleEntry } from '../indexUtils';
import { MYSTERY_MAN } from '../constants';
import SearchableIndexEntryOption from '../options/searchableIndexEntryOption';
import { getGame } from '../utils';

class _BackgroundTab extends Step {
  constructor() {
    super(StepEnum.Background);
  }

  section = () => $('#backgroundDiv');

  backgrounds!: BackgroundEntry[];
  backgroundRules?: RuleEntry;

  async setSourceData() {
    this.backgrounds = await getBackgroundEntries();
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

    const searchableOption = new SearchableIndexEntryOption(
      this.step,
      'item',
      this.backgrounds,
      this.updateBackground.bind(this),
      game.i18n.localize('HCT.Background.Select.Default'),
    );
    searchableOption.render($('[data-hct-background-search]'));

    // this.setBackgroundNameUi();
    this.setAlignmentUi();
    this.setProficienciesUi();
    this.setBackgroundFeatureUi();
  }

  setListeners(): void {
    // TODO replace this to switch between showing Background rules vs Background desc when background items become a thing
    // $('[data-hct-show-background-feature-desc]', this.section()).on('change', (ev) => {
    //   if ((ev.currentTarget as HTMLInputElement).checked) {
    //     // put  feature desc on the side
    //     const selectedBackgroundFeature = this.backgroundFeatureOption?.value() as
    //       | BackgroundFeatureEntry
    //       | null
    //       | undefined;
    //     const descToShow = selectedBackgroundFeature
    //       ? selectedBackgroundFeature.data.description.value
    //       : game.i18n.localize('HCT.Background.NoFeatureSelected');
    //     $('[data-hct_background_description]', this.section()).html(TextEditor.enrichHTML(descToShow));
    //   } else {
    //     // put Backgrounds rules on the side
    //     $('[data-hct_background_description]', this.section()).html(
    //       TextEditor.enrichHTML(this.backgroundRules?.content ?? ''),
    //     );
    //   }
    // });
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
    // const $featureArea = $('[data-hct_area=feature]', this.section());
    // this.backgroundFeatureOption = new SelectableIndexEntryOption(StepEnum.Class, 'items', this.backgrounds, {
    //   addValues: true,
    //   placeholder: {
    //     name: game.i18n.localize('HCT.Common.SelectPlaceholder'),
    //     _id: '',
    //     _pack: '',
    //     type: 'feat',
    //     img: MYSTERY_MAN,
    //   },
    // });
    // this.backgroundFeatureOption.render($featureArea);
    // this.stepOptions.push(this.backgroundFeatureOption);
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

  private async updateBackground(backgroundId: string) {
    console.log(backgroundId);

    const selectedBackground = this.backgrounds.find((e) => e._id === backgroundId);
    if (!selectedBackground) {
      throw new Error('Background not found'); //TODO i18n this
    }
    const backgroundItem = await getGame().packs.get(selectedBackground._pack)?.getDocument(selectedBackground._id);
    if (!backgroundItem) {
      throw new Error('Background not found'); //TODO i18n this
    }
    console.log(backgroundItem);
    // update icon and description
    $('[data-hct_background_icon]').attr('src', selectedBackground.img || MYSTERY_MAN);
    $('[data-hct_background_description]').html(
      TextEditor.enrichHTML((backgroundItem as any).data.data.description?.value ?? ''),
    );
  }

  // private setBackgroundNameUi() {
  //   const nameChoices = this.backgroundFeatures
  //     .filter((f) => f.data.requirements)
  //     .map((f) => ({ key: f.data.requirements, value: f.data.requirements }));
  //   const nameOption = new SelectableOption(
  //     StepEnum.Background,
  //     'data.details.background',
  //     nameChoices,
  //     '',
  //     { addValues: false, customizable: true },
  //     this.onBackgroundSelect,
  //     new Map(this.backgroundFeatures.map((obj) => [(obj.data as any).requirements, obj.name!])),
  //   );
  //   nameOption.render($('[data-hct_area=name]', this.section()));
  //   this.stepOptions.push(nameOption);
  // }

  // private onBackgroundSelect(backgroundFeatureName: string) {
  //   const $featureArea = $('[data-hct_area=feature]', $('#backgroundDiv'));
  //   const $select = $('select', $featureArea);

  //   const value = $('option', $select)
  //     .filter(function () {
  //       return $(this).text() === backgroundFeatureName;
  //     })
  //     .first()
  //     .attr('value');
  //   if (value) {
  //     $select.val(value);
  //     $select.trigger('change');
  //   }
  // }
}
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;

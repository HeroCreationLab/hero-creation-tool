import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import { Step, StepEnum } from '../step';
import SelectableOption from '../options/selectableOption';
import {
  getIndexEntryByUuid,
  getRuleJournalEntryByName,
  getBackgroundEntries,
  RuleEntry,
  BackgroundEntry,
} from '../indexes/indexUtils';
import { MYSTERY_MAN, NONE_ICON } from '../constants';
import SearchableIndexEntryOption from '../options/searchableIndexEntryOption';
import * as Advancements from '../advancementUtils';
import { getGame } from '../utils';
import FixedOption, { OptionType } from '../options/fixedOption';

class _BackgroundTab extends Step {
  constructor() {
    super(StepEnum.Background);
  }

  section = () => $('#backgroundDiv');

  private backgrounds!: BackgroundEntry[];
  private backgroundRules?: RuleEntry;

  private $backgroundIcon!: JQuery<HTMLElement>;
  private $backgroundDesc!: JQuery<HTMLElement>;
  private $backgroundData!: JQuery;

  private enrichedRules!: string;

  async setSourceData() {
    this.backgrounds = await getBackgroundEntries();
  }

  async renderData() {
    Utils.setPanelScrolls(this.section());

    this.$backgroundIcon = $('[data-hct_background_icon]');
    this.$backgroundDesc = $('[data-hct_background_description]');
    this.$backgroundData = $('[data-hct_background_data]').hide();

    // Show rules on the side panel
    const rulesCompendiumName = game.i18n.localize('HCT.Background.RulesJournalName');
    this.backgroundRules = await getRuleJournalEntryByName(rulesCompendiumName);
    if (this.backgroundRules) {
      //@ts-expect-error TextEditor TS def not updated yet
      this.enrichedRules = TextEditor.enrichHTML(this.backgroundRules.content, { async: true });
      this.$backgroundDesc.html(this.enrichedRules);
    } else {
      console.error(`Unable to find backgrounds' rule journal on compendium ${rulesCompendiumName}`);
    }

    const searchableOption = new SearchableIndexEntryOption(
      this.step,
      'items',
      this.backgrounds,
      this.updateBackground.bind(this),
      game.i18n.localize('HCT.Background.Select.Default'),
      true,
    );
    searchableOption.render($('[data-hct-background-search]'));
  }

  setListeners(): void {
    // do nothing
  }

  private async updateBackground(backgroundId: string | null) {
    if (!backgroundId) {
      this.$backgroundIcon.attr('src', NONE_ICON);
      this.$backgroundDesc.html(this.enrichedRules);
      this.$backgroundData.hide();
      this.clearOptions();
      return;
    }
    const selectedBackground = this.backgrounds.find((e) => e._id === backgroundId);
    if (!selectedBackground) {
      throw new Error(`Unexpected error - background with id [${backgroundId} ]not found`);
    }

    // FIXME remove this when advancements are indexed
    const backgroundItem = await getGame().packs.get(selectedBackground._pack)?.getDocument(selectedBackground._id);
    if (!backgroundItem) {
      throw new Error('Background not found');
    }

    this.$backgroundData.show();
    this.clearOptions();

    this.stepOptions.push(
      new FixedOption(BackgroundTab.step, 'items', selectedBackground, undefined, {
        addValues: true,
        type: OptionType.ITEM,
      }),
    );

    // update icon and description
    this.$backgroundIcon.attr('src', selectedBackground.img || MYSTERY_MAN);
    this.$backgroundDesc.html(
      //@ts-expect-error TextEditor TS def not updated yet
      TextEditor.enrichHTML((backgroundItem as any).system.description?.value ?? '', { async: true }),
    );

    if (Advancements.hasAdvancements(backgroundItem)) {
      const itemGrantAdvancements = backgroundItem.advancement.byType.ItemGrant;
      if (itemGrantAdvancements?.length) {
        const grantedItems = (await Promise.all(
          itemGrantAdvancements.flatMap((iga) => iga.data.configuration.items).map(getIndexEntryByUuid),
        )) as BackgroundEntry[];
        this.setBackgroundFeatureUi(grantedItems);
      } else {
        this.setBackgroundFeatureUi([]);
      }
    }

    this.setAlignmentUi();
    this.setProficienciesUi();
  }

  private async setProficienciesUi() {
    const $proficienciesArea = $('[data-hct_area=proficiences]', this.section()).empty();
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

  private setBackgroundFeatureUi(features: BackgroundEntry[]) {
    const $featureArea = $('[data-hct_area=feature]', this.section()).empty();
    features.forEach((feature) => {
      const featureOption = new FixedOption(this.step, 'items', feature, undefined, {
        addValues: true,
        type: OptionType.ITEM,
      });
      featureOption.render($featureArea);
      this.stepOptions.push(featureOption);
    });
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
    alignmentOption.render($('[data-hct_area=alignment]', this.section()).empty());
    this.stepOptions.push(alignmentOption);
  }
}
const BackgroundTab: Step = new _BackgroundTab();
export default BackgroundTab;

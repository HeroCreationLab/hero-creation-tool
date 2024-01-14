/*
  Functions used exclusively on the Race tab
*/
import { Step, StepEnum } from './step';
import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import HeroOption from '../options/heroOption';
import HiddenOption from '../options/hiddenOption';
import SelectableOption from '../options/selectableOption';
import FixedOption, { OptionType } from '../options/fixedOption';
import InputOption from '../options/inputOption';
import SearchableIndexEntryOption from '../options/searchableIndexEntryOption';
import { getRaceEntries, getRaceFeatureEntries, getFeatEntries } from '../indexes/getEntries';
import { RaceEntry } from '../indexes/entries/raceEntry';
import { RacialFeatureEntry } from '../indexes/entries/racialFeatureEntry';
import { FeatEntry } from '../indexes/entries/featEntry';
import { MYSTERY_MAN, NONE_ICON } from '../constants';
import { getGame } from '../utils';
import { AbilityScoreAdvancementEntry } from '../indexes/entries/advancementEntry';

class _Race extends Step {
  private raceEntries?: RaceEntry[];
  private raceFeatures?: RacialFeatureEntry[];

  private feats?: FeatEntry[];

  private $context!: JQuery;
  private $raceIcon!: JQuery;
  private $raceDesc!: JQuery;

  constructor() {
    super(StepEnum.Race);
  }

  section = () => $('#raceDiv');

  setListeners(): void {
    this.$context = $('[data-hct_race_data]', this.section());
  }

  async setSourceData() {
    this.raceEntries = await getRaceEntries();
    this.raceFeatures = await getRaceFeatureEntries();
    const featIndexEntries = await getFeatEntries();
    this.feats = featIndexEntries.sort((a, b) => a.name.localeCompare(b.name));
  }

  async renderData() {
    Utils.setPanelScrolls(this.section());
    const $dataSection = $('[data-hct_race_data]').hide();
    this.$raceIcon = $('[data-hct_race_icon]', this.section());
    this.$raceDesc = $('[data-hct_race_description]', this.section());

    if (!this.raceEntries) {
      ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Races' }));
      return;
    }

    const searchableOption = new SearchableIndexEntryOption(
      this.step,
      'items',
      this.raceEntries,
      async (raceId) => {
        if (!raceId) {
          $dataSection.hide();
          this.$raceIcon.attr('src', NONE_ICON);
          this.$raceDesc.html(getGame().i18n.localize('HCT.Race.DescriptionPlaceholder'));
          return;
        }
        if (!this.raceEntries) {
          ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Races' }));
          return;
        }
        const selectedRace = this.raceEntries.find((e) => e._id === raceId);
        if (!selectedRace) {
          throw new Error(`No race found for id ${raceId}`);
        }
        console.log('selected race: ', selectedRace);
        this.updateRace(selectedRace.name, selectedRace);

        // update icon and description
        this.$raceIcon.attr('src', selectedRace.img || MYSTERY_MAN);
        //@ts-expect-error TextEditor TS def not updated yet
        this.$raceDesc.html(await TextEditor.enrichHTML(selectedRace.system.description.value, { async: true }));
      },
      game.i18n.localize('HCT.Race.Select.Default'),
      true,
    );
    searchableOption.render($('[data-hct-race-search]'));
  }

  updateRace(raceName: string, raceItem: RaceEntry) {
    this.clearOptions();

    this.setAbilityScoresUi(raceItem);
    this.setSizeUi();
    this.setSensesUi();
    this.setMovementUi();
    this.setProficienciesUi();
    this.setRaceFeaturesUi(raceItem);
    this.setFeatsUi();

    this.$context.show();

    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'items', raceItem, { addValues: true }));
    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'data.details.race', raceName));
  }

  async setProficienciesUi() {
    const $proficienciesSection = $('[data-hct_race_area=proficiencies]', this.$context).empty();
    const options = [];
    options.push(
      ProficiencyUtils.prepareSkillOptions({
        step: this.step,
        $parent: $proficienciesSection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: false,
      }),
    );

    options.push(
      await ProficiencyUtils.prepareWeaponOptions({
        step: this.step,
        $parent: $proficienciesSection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.push(
      await ProficiencyUtils.prepareArmorOptions({
        step: this.step,
        $parent: $proficienciesSection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.push(
      await ProficiencyUtils.prepareToolOptions({
        step: this.step,
        $parent: $proficienciesSection,
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
        $parent: $proficienciesSection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.forEach((o) => o.render($proficienciesSection));
    this.stepOptions.push(...options);
  }

  setMovementUi(): void {
    const movementOption = new InputOption(StepEnum.Race, 'data.attributes.movement.walk', '', 30, {
      addValues: false,
      type: 'number',
      preLabel: game.i18n.localize(`HCT.Common.Movement.walk`),
      postLabel: 'ft',
      class: 'hct-w-6/12',
    });
    const $movementSection = $('[data-hct_race_area=movement]', this.$context).empty();
    movementOption.render($movementSection);
    this.stepOptions.push(movementOption);
  }

  setSensesUi(): void {
    const sensesOption = new InputOption(StepEnum.Race, 'data.attributes.senses.darkvision', '', 0, {
      addValues: false,
      type: 'number',
      preLabel: game.i18n.localize(`HCT.Common.Senses.darkvision`),
      postLabel: 'ft',
      class: 'hct-w-6/12',
    });
    const $sensesSection = $('[data-hct_race_area=senses]', this.$context).empty();
    sensesOption.render($sensesSection);
    this.stepOptions.push(sensesOption);
  }

  setSizeUi(): void {
    const sizeOption = new SelectableOption(StepEnum.Race, 'data.traits.size', getSizeOptions(), '', {
      addValues: false,
      default: 'med',
      customizable: false,
    });
    const $sizeSection = $('[data-hct_race_area=size]', this.$context).empty();
    sizeOption.render($sizeSection);
    this.stepOptions.push(sizeOption);
  }

  setAbilityScoresUi(entry: RaceEntry): void {
    const foundryAbilities = (game as any).dnd5e.config.abilities as { [key: string]: dnd5eConfigAbility };
    let options;

    const raceAsiAdvancement = entry.system.advancement.find(
      (adv) => adv.type == 'AbilityScoreImprovement',
    ) as AbilityScoreAdvancementEntry;

    if (raceAsiAdvancement) {
      const config = raceAsiAdvancement.configuration;
      options = Object.keys(foundryAbilities).map((key) => {
        const ability = foundryAbilities[key];
        const fixedBonus = (config.fixed as any)[ability.abbreviation];

        return new InputOption(
          StepEnum.Race,
          `data.abilities.${ability.abbreviation.toLowerCase()}.value`,
          '',
          fixedBonus,
          {
            addValues: true,
            type: 'number',
            preLabel: ability.label,
            class: 'hct-w-6/12',
            data: `data-hct-race-ability='${ability.abbreviation}'`,
            disabled: !!fixedBonus || !config.points,
          },
        );
      });
    } else {
      // FALLBACK :: race has no AbilityScoreAdvancement
      options = Object.keys(foundryAbilities).map((key) => {
        const ability = foundryAbilities[key];
        return new InputOption(StepEnum.Race, `data.abilities.${ability.abbreviation.toLowerCase()}.value`, '', 0, {
          addValues: true,
          type: 'number',
          preLabel: ability.label,
          class: 'hct-w-6/12',
          data: `data-hct-race-ability='${ability.abbreviation}'`,
        });
      });
    }

    const $abilityScoreSection = $('[data-hct_race_area=abilityScores]', this.$context).empty();
    options.forEach((o) => o.render($abilityScoreSection));
    this.stepOptions.push(...options);
  }

  setRaceFeaturesUi(raceItem: RaceEntry): void {
    const options: HeroOption[] = [];
    const raceFeatures: RacialFeatureEntry[] = Utils.filterItemList({
      filterValues: [raceItem.name],
      filterField: 'system.requirements',
      itemList: this.raceFeatures!,
    });
    raceFeatures.forEach((feature) => {
      const featureOption = new FixedOption(RaceTab.step, 'items', feature, undefined, {
        addValues: true,
        type: OptionType.ITEM,
      });
      options.push(featureOption);
    });

    const $raceFeaturesSection = $('[data-hct_race_area=features]', this.$context).empty();
    options.forEach((o) => o.render($raceFeaturesSection));
    this.stepOptions.push(...options);
  }

  setFeatsUi(): void {
    const $featSection = $('[data-hct_race_area=feat]', this.$context).empty();

    const handleFeatSelected = (featId: string | null) => {
      if (!featId) return;
      const featEntry = this.feats?.find((f) => f._id == featId);
      if (!featEntry) {
        ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Feats' })); // FIXME i18n
        return;
      }
      const $imgLink = $('[data-hct_feat_icon]', this.$context);
      $imgLink.attr('data-uuid', featEntry._uuid ?? '');
      $('img', $imgLink)
        .attr('src', featEntry.img ?? MYSTERY_MAN)
        .addClass('hct-hover-shadow-accent');
    };

    const featOption: HeroOption = new SearchableIndexEntryOption(
      this.step,
      'items',
      this.feats ?? [],
      handleFeatSelected,
    );
    featOption.render($featSection);
    this.stepOptions.push(featOption);
  }
}
const RaceTab: Step = new _Race();
export default RaceTab;

function getSizeOptions(): Record<string, string>[] {
  const foundrySizes = (game as any).dnd5e.config.actorSizes;

  return Object.keys(foundrySizes).map((k) => ({ key: k, value: foundrySizes[k] }));
}

type dnd5eConfigAbility = {
  label: string;
  abbreviation: string;
  type: 'physical' | 'mental';
};

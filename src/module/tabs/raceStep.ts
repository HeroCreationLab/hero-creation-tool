/*
  Functions used exclusively on the Race tab
*/
import { Step, StepEnum } from '../Step';
import * as Utils from '../utils';
import * as Constants from '../constants';
import * as ProficiencyUtils from '../proficiencyUtils';
import HeroOption from '../options/HeroOption';
import HiddenOption from '../options/HiddenOption';
import SelectableOption from '../options/SelectableOption';
import FixedOption, { OptionType } from '../options/FixedOption';
import InputOption from '../options/InputOption';
import SearchableIndexEntryOption from '../options/SearchableIndexEntryOption';
import {
  FeatEntry,
  getFeatEntries,
  getRaceEntries,
  getRaceFeatureEntries,
  IndexEntry,
  RaceEntry,
  RacialFeatureEntry,
} from '../indexUtils';
import SettingKeys from '../settings';

type KeyValue = {
  key: string;
  value: string;
};

class _Race extends Step {
  raceEntries?: RaceEntry[];
  pickableRaces?: RaceEntry[];
  raceFeatures?: RacialFeatureEntry[];

  feats?: FeatEntry[];

  $context!: JQuery;

  subraceBlacklist?: string[];

  constructor() {
    super(StepEnum.Race);
  }

  section = () => $('#raceDiv');

  setListeners(): void {
    this.$context = $('[data-hct_race_data]', this.section());
  }

  async setSourceData() {
    this.raceEntries = await getRaceEntries();
    const raceNames = this.raceEntries.filter((entry) => entry.data?.requirements == '').map((race) => race.name);

    const raceFeatureIndexEntries = await getRaceFeatureEntries();
    this.raceFeatures = raceFeatureIndexEntries?.filter((entry) => !raceNames.includes(entry.name)); //filters out subraces from features

    const featIndexEntries = await getFeatEntries();
    this.feats = featIndexEntries.sort((a, b) => a.name.localeCompare(b.name));

    this.subraceBlacklist = (Utils.getModuleSetting(SettingKeys.SUBRACES_BLACKLIST) as string)
      .split(';')
      .map((e) => e.trim());
  }

  renderData(): void {
    Utils.setPanelScrolls(this.section());
    $('[data-hct_race_data]').hide();
    if (!this.raceEntries) {
      ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Races' }));
      return;
    }

    const searchableOption = new SearchableIndexEntryOption(
      this.step,
      'item',
      getPickableRaces(this.raceEntries, this.subraceBlacklist ?? []),
      (raceId) => {
        // callback on selected
        if (!this.raceEntries) {
          ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Races' }));
          return;
        }
        const selectedRace = this.raceEntries.find((e) => e._id === raceId);
        if (!selectedRace) {
          throw new Error(`No race found for id ${raceId}`);
        }
        const parentRace = getParentRace(selectedRace, this.raceEntries);
        this.updateRace(selectedRace.name, parentRace ? [parentRace, selectedRace] : [selectedRace]);

        // update icon and description
        $('[data-hct_race_icon]').attr('src', selectedRace.img || Constants.MYSTERY_MAN);
        if (parentRace) {
          $('[data-hct_race_description]').html(TextEditor.enrichHTML(parentRace.data.description.value));
          $('[data-hct_subrace_description]').html(TextEditor.enrichHTML(selectedRace.data.description.value));
        } else {
          $('[data-hct_race_description]').html(TextEditor.enrichHTML(selectedRace.data.description.value));
          $('[data-hct_subrace_description]').empty();
        }
        $('[data-hct_subrace_separator]').toggle(!!parentRace);
      },
      game.i18n.localize('HCT.Race.Select.Default'),
    );
    searchableOption.render($('[data-hct-race-search]'));
  }

  updateRace(raceName: string, raceItems: RaceEntry[]) {
    this.clearOptions();

    this.setAbilityScoresUi();
    this.setSizeUi();
    this.setSensesUi();
    this.setMovementUi();
    this.setProficienciesUi();
    this.setRaceFeaturesUi(raceItems);
    this.setFeatsUi();

    this.$context.show();

    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'items', raceItems, { addValues: true }));
    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'data.details.race', raceName));
  }

  async setProficienciesUi() {
    const $proficienciesSection = $('section', $('[data-hct_race_area=proficiencies]', this.$context)).empty();
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
      class: 'hct-width-half',
    });
    const $movementSection = $('section', $('[data-hct_race_area=movement]', this.$context)).empty();
    movementOption.render($movementSection);
    this.stepOptions.push(movementOption);
  }

  setSensesUi(): void {
    const sensesOption = new InputOption(StepEnum.Race, 'data.attributes.senses.darkvision', '', 0, {
      addValues: false,
      type: 'number',
      preLabel: game.i18n.localize(`HCT.Common.Senses.darkvision`),
      postLabel: 'ft',
      class: 'hct-width-half',
    });
    const $sensesSection = $('section', $('[data-hct_race_area=senses]', this.$context)).empty();
    sensesOption.render($sensesSection);
    this.stepOptions.push(sensesOption);
  }

  setSizeUi(): void {
    const sizeOption = new SelectableOption(StepEnum.Race, 'data.traits.size', getSizeOptions(), '', {
      addValues: false,
      default: 'med',
      customizable: false,
    });
    const $sizeSection = $('section', $('[data-hct_race_area=size]', this.$context)).empty();
    sizeOption.render($sizeSection);
    this.stepOptions.push(sizeOption);
  }

  setAbilityScoresUi(): void {
    const foundryAbilities = (game as any).dnd5e.config.abilities;
    const options = Object.keys(foundryAbilities).map((key) => {
      return new InputOption(StepEnum.Race, `data.abilities.${(key as string).toLowerCase()}.value`, '', 0, {
        addValues: true,
        type: 'number',
        preLabel: `${foundryAbilities[key]}`,
        class: 'hct-width-half',
      });
    });
    const $abilityScoreSection = $('section', $('[data-hct_race_area=abilityScores]', this.$context)).empty();
    options.forEach((o) => o.render($abilityScoreSection));
    this.stepOptions.push(...options);
  }

  setRaceFeaturesUi(raceItems: IndexEntry[]): void {
    const options: HeroOption[] = [];
    const raceFeatures: IndexEntry[] = Utils.filterItemList({
      filterValues: raceItems.map((r) => r.name!),
      filterField: 'data.requirements',
      itemList: this.raceFeatures!,
    });
    raceFeatures.forEach((feature) => {
      const featureOption = new FixedOption(RaceTab.step, 'items', feature, undefined, {
        addValues: true,
        type: OptionType.ITEM,
      });
      options.push(featureOption);
    });

    const $raceFeaturesSection = $('section', $('[data-hct_race_area=features]', this.$context)).empty();
    options.forEach((o) => o.render($raceFeaturesSection));
    this.stepOptions.push(...options);
  }

  setFeatsUi(): void {
    const featOption: HeroOption = new SearchableIndexEntryOption(this.step, 'items', this.feats ?? [], (featId) => {
      const featEntry = this.feats?.find((f) => f._id == featId);
      if (!featEntry) {
        ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Feats' }));
        return;
      }
      const $imgLink = $('[data-hct_feat_icon]', this.$context);
      $imgLink.attr('data-pack', featEntry._pack ?? '');
      $imgLink.attr('data-id', featEntry._id ?? '');
      $('img', $imgLink).attr('src', featEntry.img ?? Constants.MYSTERY_MAN);
    });
    const $raceFeaturesSection = $('section', $('[data-hct_race_area=feat]', this.$context)).empty();
    featOption.render($raceFeaturesSection);
    this.stepOptions.push(featOption);
  }
}
const RaceTab: Step = new _Race();
export default RaceTab;

function getSizeOptions(): KeyValue[] {
  const foundrySizes = (game as any).dnd5e.config.actorSizes;

  return Object.keys(foundrySizes).map((k) => ({ key: k, value: foundrySizes[k] }));
}

function validSubraceName(name: string, misleadingFeatureNames: string[]): boolean {
  return !misleadingFeatureNames.includes(name);
}

function subraceNameIsPartOfRaceName(subraceName: string, parentName: string): boolean {
  if (parentName.includes(' ')) {
    return subraceName.includes(parentName);
  } else {
    return subraceName.split(' ').includes(parentName);
  }
}

function parentListedAsRequirement(subrace: RaceEntry, parentName: string): boolean {
  return parentName.includes(subrace.data.requirements);
}

function getPickableRaces(raceEntries: RaceEntry[], misleadingFeatureNames: string[]): IndexEntry[] {
  const pickableRaces = raceEntries.filter((e) => e.data.requirements == ''); // start with parent races / races without subclasses

  const notParentEntries = raceEntries.filter((e) => e.data.requirements !== '');
  notParentEntries.forEach((e) => {
    if (validSubraceName(e.name, misleadingFeatureNames)) {
      // find parent race
      const parent = pickableRaces.find((p) => e.name.includes(p.name));

      if (parent && parentListedAsRequirement(e, parent.name) && subraceNameIsPartOfRaceName(e.name, parent.name)) {
        const index = pickableRaces.indexOf(parent);
        if (index > -1) {
          pickableRaces.splice(index, 1); // removing parent race from list.
        }
        pickableRaces.push(e);
      }
    }
  });

  return pickableRaces.sort((a, b) => a.name.localeCompare(b.name));
}

function getParentRace(selectedRace: RaceEntry, raceEntries: RaceEntry[]) {
  if (selectedRace.data.requirements == '') return null;

  return raceEntries.find((e) => e.name === selectedRace.data.requirements);
}

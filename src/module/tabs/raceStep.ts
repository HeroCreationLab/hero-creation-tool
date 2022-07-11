/*
  Functions used exclusively on the Race tab
*/
import { Step, StepEnum } from '../step';
import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import HeroOption from '../options/heroOption';
import HiddenOption from '../options/hiddenOption';
import SelectableOption from '../options/selectableOption';
import FixedOption, { OptionType } from '../options/fixedOption';
import InputOption from '../options/inputOption';
import SearchableIndexEntryOption from '../options/searchableIndexEntryOption';
import {
  IndexEntry,
  FeatEntry,
  getFeatEntries,
  RaceEntry,
  getRaceEntries,
  RacialFeatureEntry,
  getRaceFeatureEntries,
} from '../indexes/indexUtils';
import SettingKeys from '../settings';
import { MYSTERY_MAN, NONE_ICON } from '../constants';
import { getGame } from '../utils';

type KeyValue = {
  key: string;
  value: string;
};

class _Race extends Step {
  private raceEntries?: RaceEntry[];
  // private pickableRaces?: RaceEntry[];
  private raceFeatures?: RacialFeatureEntry[];

  private feats?: FeatEntry[];

  private $context!: JQuery;
  private $raceIcon!: JQuery;
  private $raceDesc!: JQuery;
  private $subraceDesc!: JQuery;

  private subraceBlacklist?: string[];

  constructor() {
    super(StepEnum.Race);
  }

  section = () => $('#raceDiv');

  setListeners(): void {
    this.$context = $('[data-hct_race_data]', this.section());
  }

  async setSourceData() {
    this.raceEntries = await getRaceEntries();
    const raceNames = this.raceEntries.filter((entry) => entry.system?.requirements == '').map((race) => race.name);

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
    const $dataSection = $('[data-hct_race_data]').hide();
    this.$raceIcon = $('[data-hct_race_icon]', this.section());
    this.$raceDesc = $('[data-hct_race_description]', this.section());
    this.$subraceDesc = $('[data-hct_subrace_description]', this.section());
    const $subraceSeparator = $('[data-hct_subrace_separator]', this.section());

    if (!this.raceEntries) {
      ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Races' }));
      return;
    }

    const searchableOption = new SearchableIndexEntryOption(
      this.step,
      'items',
      getPickableRaces(this.raceEntries, this.subraceBlacklist ?? []),
      (raceId) => {
        if (!raceId) {
          $dataSection.hide();
          this.$raceIcon.attr('src', NONE_ICON);
          this.$raceDesc.html(getGame().i18n.localize('HCT.Race.DescriptionPlaceholder'));
          this.$subraceDesc.empty();
          $subraceSeparator.toggle(false);
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
        const parentRace = getParentRace(selectedRace, this.raceEntries);
        this.updateRace(selectedRace.name, parentRace ? [parentRace, selectedRace] : [selectedRace]);

        // update icon and description
        this.$raceIcon.attr('src', selectedRace.img || MYSTERY_MAN);
        if (parentRace) {
          //@ts-expect-error TextEditor TS def not updated yet
          this.$raceDesc.html(TextEditor.enrichHTML(parentRace.system.description.value, { async: true }));
          //@ts-expect-error TextEditor TS def not updated yet
          this.$subraceDesc.html(TextEditor.enrichHTML(selectedRace.system.description.value, { async: true }));
        } else {
          //@ts-expect-error TextEditor TS def not updated yet
          this.$raceDesc.html(TextEditor.enrichHTML(selectedRace.system.description.value, { async: true }));
          this.$subraceDesc.empty();
        }
        $subraceSeparator.toggle(!!parentRace);
      },
      game.i18n.localize('HCT.Race.Select.Default'),
      true,
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

  setAbilityScoresUi(): void {
    const foundryAbilities = (game as any).dnd5e.config.abilities;
    const options = Object.keys(foundryAbilities).map((key) => {
      return new InputOption(StepEnum.Race, `data.abilities.${(key as string).toLowerCase()}.value`, '', 0, {
        addValues: true,
        type: 'number',
        preLabel: `${foundryAbilities[key]}`,
        class: 'hct-w-6/12',
        data: `data-hct-race-ability='${key}'`,
      });
    });
    const $abilityScoreSection = $('[data-hct_race_area=abilityScores]', this.$context).empty();
    options.forEach((o) => o.render($abilityScoreSection));
    this.stepOptions.push(...options);
  }

  setRaceFeaturesUi(raceItems: IndexEntry[]): void {
    const options: HeroOption[] = [];
    const raceFeatures: RacialFeatureEntry[] = Utils.filterItemList({
      filterValues: raceItems.map((r) => r.name!),
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
      $imgLink.attr('data-pack', featEntry._pack ?? '');
      $imgLink.attr('data-id', featEntry._id ?? '');
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
    return subraceName.includes(' ') ? subraceName.split(' ').includes(parentName) : subraceName.includes(parentName);
  }
}

function parentListedAsRequirement(subrace: RaceEntry, parentName: string): boolean {
  return parentName.includes(subrace.system.requirements);
}

function getPickableRaces(raceEntries: RaceEntry[], misleadingFeatureNames: string[]): IndexEntry[] {
  const pickableRaces = raceEntries.filter((e) => e.system.requirements == ''); // start with parent races / races without subclasses

  const notParentEntries = raceEntries.filter((e) => e.system.requirements !== '');
  const parentsToRemove: Set<RaceEntry> = new Set(); // all classes with children are deleted at the end
  notParentEntries.forEach((e) => {
    if (validSubraceName(e.name, misleadingFeatureNames)) {
      const parent = pickableRaces.find(
        (p) => parentListedAsRequirement(e, p.name) && subraceNameIsPartOfRaceName(e.name, p.name),
      );
      if (parent) {
        // if parent found, add it to the set so main races with children are later removed from the list
        parentsToRemove.add(parent);
        pickableRaces.push(e);
      }
    }
  });
  parentsToRemove.forEach((p) => pickableRaces.splice(pickableRaces.indexOf(p), 1));

  return pickableRaces.sort((a, b) => a.name.localeCompare(b.name));
}

function getParentRace(selectedRace: RaceEntry, raceEntries: RaceEntry[]) {
  if (selectedRace.system.requirements == '') return null;

  return raceEntries.find((e) => e.name === selectedRace.system.requirements);
}

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

type KeyValue = {
  key: string;
  value: string;
};

type Race = {
  name: string;
  item: Item;
  subraces?: Item[];
};

class _Race extends Step {
  races?: Race[];
  raceFeatures?: Item[];

  $context!: JQuery;

  constructor() {
    super(StepEnum.Race);
  }

  section = () => $('#raceDiv');

  setListeners(): void {
    this.$context = $('[data-hct_race_data]', this.section());
    $('[data-hct_race_picker]').on('change', async (event) => {
      const raceName = $(event.currentTarget).val();
      if (this.races) {
        const raceParts = raceName?.toString().split('.');
        if (!raceParts) throw new Error('invalid race splitting on select');

        const raceGroup = this.races.find((race) => race.name == raceParts[0]);
        if (!raceGroup) {
          throw new Error(`No parent race found for ${raceParts}`);
        }
        const raceItems = [raceGroup.item];
        if (raceParts!.length > 1) {
          // has subclass
          const subraceItem = raceGroup.subraces?.find((subrace) => subrace.name == raceParts[1]);
          if (!raceGroup) {
            throw new Error(`No subrace found for ${raceParts}`);
          }
          raceItems.push(subraceItem!);
        }
        this.updateRace(raceParts[raceParts.length - 1] as string, raceItems);

        // update icon and description
        const racetoShow = raceItems[raceItems.length - 1];
        $('[data-hct_race_icon]').attr('src', racetoShow.img || Constants.MYSTERY_MAN);
        const hasSubclass = raceItems.length == 2;
        if (hasSubclass) {
          $('[data-hct_race_description]').html(TextEditor.enrichHTML((raceItems[0].data as any).description.value));
          $('[data-hct_subrace_description]').html(TextEditor.enrichHTML((raceItems[1].data as any).description.value));
        } else {
          $('[data-hct_race_description]').html(TextEditor.enrichHTML((racetoShow.data as any).description.value));
          $('[data-hct_subrace_description]').empty();
        }
        $('[data-hct_subrace_separator]').toggle(hasSubclass);
      } else ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Races' }));
    });
  }

  async setSourceData() {
    const raceItems = await Utils.getSources('races');
    // get races
    const races: Race[] = raceItems
      ?.filter((race) => (race as any).data.requirements == '')
      .map((race) => ({ name: race.name, item: race, subraces: [] }))
      .sort((a, b) => a.name.localeCompare(b.name)) as any;
    const raceNames = races.map((race) => race.name);

    this.races = races.map((parent) => {
      const children = raceItems
        ?.filter((subrace) => {
          const isChildren =
            parent.name !== subrace.name &&
            !raceNames.includes(subrace.name) &&
            subrace.name.includes(parent.name) &&
            !excludedSubraceName(subrace.name);
          return isChildren;
        })
        .sort((a, b) => a.name.localeCompare(b.name));
      parent.subraces = children as any;
      raceNames.push(...children.map((c) => c.name));
      return parent;
    });

    const raceFeatureItems = await Utils.getSources('racialFeatures');
    this.raceFeatures = raceFeatureItems
      ?.filter((item) => !raceNames.includes(item.name))
      .sort((a, b) => a.name.localeCompare(b.name)) as any;
  }

  renderData(): void {
    $('[data-hct_race_data]').hide();
    if (this.races) setRaceOptions(this.races);
    else ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Races' }));
  }

  updateRace(raceName: string, raceItems: Item[]) {
    this.clearOptions();

    this.setAbilityScoresUi();
    this.setSizeUi();
    this.setSensesUi();
    this.setMovementUi();
    this.setProficienciesUi();
    this.setRaceFeaturesUi(raceItems);

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

  setRaceFeaturesUi(raceItems: Item[]): void {
    const options: HeroOption[] = [];
    const raceFeatures: Item[] = Utils.filterItemList({
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
}
const RaceTab: Step = new _Race();
export default RaceTab;

function setRaceOptions(races: Race[]) {
  const picker = $('[data-hct_race_picker]');
  for (const race of races) {
    if (race.subraces?.length) {
      const $group = $(
        `<optgroup class='hct_picker_primary hct_picker_primary_group' label="${race.name}"></optgroup>`,
      );
      race.subraces.forEach((subrace) => {
        $group.append(
          $(`<option class='hct_picker_secondary' value="${race.name}.${subrace.name}">${subrace.name}</option>`),
        );
        picker.append($group);
      });
    } else {
      // race is standalone - make an option
      picker.append($(`<option class='hct_picker_primary' value="${race.name}">${race.name}</option>`));
    }
  }
}

function getSizeOptions(): KeyValue[] {
  const foundrySizes = (game as any).dnd5e.config.actorSizes;

  return Object.keys(foundrySizes).map((k) => ({ key: k, value: foundrySizes[k] }));
}

const misleadingFeatureNames: string[] = ['Gnome Cunning', 'Halfling Nimbleness'];
function excludedSubraceName(name: string): boolean {
  return misleadingFeatureNames.includes(name);
}

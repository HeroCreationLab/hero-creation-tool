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
import { DND5E, getGame } from '../system.utils';
import {
  AbilityScoreAdvancementEntry,
  SizeAdvancementEntry,
  TraitAdvancementEntry,
} from '../indexes/entries/advancementEntry';
import { AdvancementType } from '../advancements/advancementType';

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
    this.setSizeUi(raceItem);
    this.setSensesUi();
    this.setMovementUi();
    this.setTraitsUi(raceItem);
    this.setRaceFeaturesUi(raceItem);
    this.setFeatsUi();

    this.$context.show();

    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'items', [raceItem], { addValues: true }));
    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'data.details.race', raceName));
  }

  async setTraitsUi(entry: RaceEntry) {
    const $traitsSection = $('[data-hct_race_area=traits]', this.$context).empty();
    const options = [];

    const traitAdvancements = entry?.system?.advancement?.filter(
      (adv) => adv.type == AdvancementType.TRAIT,
    ) as TraitAdvancementEntry[];

    if (!traitAdvancements || traitAdvancements.length === 0) {
      // FALLBACK :  show hand-picked trait selectors
      options.push(...(await _getFallbackTraitSelectorOptions(this.step, $traitsSection)));
      options.forEach((o) => o.render($traitsSection));
    } else {
      console.log(traitAdvancements);
      const traitTypes = ['saves', 'skills', 'languages', 'weapon', 'armor', 'tool', 'di', 'dr', 'dv', 'ci'];

      traitTypes.forEach((traitKey) => {
        console.log('handling trait type ', traitKey);
        const saveOptions = _buildTraitOptions({ traitAdvancements, traitKey });

        if (saveOptions.length) {
          $traitsSection.append($(`<h3>${Utils.localize('Traits.' + traitKey)}</h3>`));
        }

        saveOptions.forEach((o) => o.render($traitsSection));
        options.push(...saveOptions);
      });
    }

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

  setSizeUi(entry: RaceEntry): void {
    const raceSizeAdvancement = entry.system.advancement.find(
      (adv) => adv.type == AdvancementType.SIZE,
    ) as SizeAdvancementEntry;

    const foundrySizes = getGame().dnd5e.config.actorSizes;

    const sizeOption = raceSizeAdvancement
      ? new SelectableOption(
          StepEnum.Race,
          'data.traits.size',
          getSizeOptions(raceSizeAdvancement.configuration.sizes),
          '',
          {
            addValues: false,
            default: raceSizeAdvancement.configuration.sizes[0],
            advancement: { type: AdvancementType.SIZE, origin: StepEnum.Race, exclude: false },
            customizable: false,
          },
        )
      : // FALLBACK :: race has no SizeAdvancement
        new SelectableOption(StepEnum.Race, 'data.traits.size', getSizeOptions(), '', {
          addValues: false,
          default: 'med',
          customizable: false,
        });

    const $sizeSection = $('[data-hct_race_area=size]', this.$context).empty();

    if (raceSizeAdvancement?.configuration?.hint) {
      const hintText = highlightActorSizesInText(raceSizeAdvancement.configuration.hint, foundrySizes);
      $sizeSection.append($(`<p>${hintText}</p>`));
    }

    sizeOption.render($sizeSection);
    this.stepOptions.push(sizeOption);
  }

  setAbilityScoresUi(entry: RaceEntry): void {
    const foundryAbilities = (game as any).dnd5e.config.abilities as { [key: string]: dnd5eConfigAbility };
    let options;

    const raceAsiAdvancement = entry.system.advancement.find(
      (adv) => adv.type == AdvancementType.ABILITY_SCORE_IMPROVEMENT,
    ) as AbilityScoreAdvancementEntry;

    // TODO add prefix for "+2" instead of "2" for added clarity this is a bonus
    if (raceAsiAdvancement) {
      const config = raceAsiAdvancement.configuration;
      options = Object.keys(foundryAbilities).map((key) => {
        const ability = foundryAbilities[key];
        const fixedBonus = (config.fixed as any)[ability.abbreviation];

        return new InputOption(StepEnum.Race, `data.abilities.${ability.abbreviation}.value`, '', fixedBonus, {
          advancement: { type: AdvancementType.ABILITY_SCORE_IMPROVEMENT, origin: StepEnum.Race, exclude: false },
          addValues: true,
          type: 'number',
          preLabel: ability.label,
          class: 'hct-w-6/12',
          data: `data-hct-race-ability='${ability.abbreviation}'`,
          disabled: !!fixedBonus || !config.points,
        });
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

function getSizeOptions(raceSizeKeys?: string[]): Record<string, string>[] {
  const foundrySizes = (game as any).dnd5e.config.actorSizes;

  return (raceSizeKeys ?? Object.keys(foundrySizes)).map((k: string) => ({ key: k, value: foundrySizes[k] }));
}

type dnd5eConfigAbility = {
  label: string;
  abbreviation: string;
  type: 'physical' | 'mental';
};

function highlightActorSizesInText(hint: string, foundrySizes: typeof DND5E.SIZES): string {
  return Object.values(foundrySizes).reduce((accHint, currentSize) => {
    return accHint.replace(currentSize, `<b>${currentSize}</b>`);
  }, hint);
}

async function _getFallbackTraitSelectorOptions(step: StepEnum, $traitsSection: JQuery): Promise<HeroOption[]> {
  const options = [];

  options.push(
    ProficiencyUtils.prepareLanguageOptions({
      step,
      $parent: $traitsSection,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    }),
  );

  options.push(
    ProficiencyUtils.prepareSkillOptions({
      step,
      $parent: $traitsSection,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: false,
    }),
  );

  options.push(
    await ProficiencyUtils.prepareWeaponOptions({
      step,
      $parent: $traitsSection,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    }),
  );

  options.push(
    await ProficiencyUtils.prepareArmorOptions({
      step,
      $parent: $traitsSection,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    }),
  );

  options.push(
    await ProficiencyUtils.prepareToolOptions({
      step,
      $parent: $traitsSection,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    }),
  );

  return options;
}

function _filterTraitAdvancementsForKey(
  traitAdvancements: TraitAdvancementEntry[],
  traitKey: string,
): TraitAdvancementEntry[] {
  return traitAdvancements.filter(
    (t) =>
      [...t.configuration.grants].every((g) => g?.startsWith(traitKey)) &&
      [...t.configuration.choices].every((c) => [...c.pool].every((cp) => cp?.startsWith(traitKey))),
  );
}

function _buildTraitOptions(opts: { traitAdvancements: TraitAdvancementEntry[]; traitKey: string }): HeroOption[] {
  const { traitAdvancements, traitKey } = opts;
  const traitsAdvsForKey = _filterTraitAdvancementsForKey(traitAdvancements, traitKey);
  console.log(`traits for ${opts.traitKey} `, traitsAdvsForKey);

  const step = StepEnum.Race;
  const options: HeroOption[] = [];
  traitsAdvsForKey.forEach((trait) => {
    // add disabled select with single option
    const grantOptions = [...trait.configuration.grants].map((grantedTrait) => {
      const opt = new SelectableOption(
        step,
        _getActorKeyForTrait(trait.type),
        _getOptionsForTrait(trait.type),
        'label for trait ' + trait.title,
        {
          addValues: false,
          default: grantedTrait.substring(grantedTrait.indexOf(':') + 1),
          advancement: { type: AdvancementType.SIZE, origin: step, exclude: false },
          customizable: false,
        },
      );
      return opt;
    });
    options.push(...grantOptions);

    // add select with choices
    // const choiceOptions = [...trait.configuration.choices].map((chosenTrait) => {});
    // options.push(...choiceOptions);
  });

  return options;
}
function _getActorKeyForTrait(type: AdvancementType): string {
  throw new Error('Function not implemented.');
}

function _getOptionsForTrait(type: AdvancementType): Record<string, string>[] {
  throw new Error('Function not implemented.');
}

/*
  Functions used exclusively on the Race tab
*/
import { Step, StepEnum } from '../Step';
import Race, { ChoosableChoice, Movement } from '../types/Race';
import * as Utils from '../utils';
import { Size, SizeLabel } from '../types/Size';
import { Skill, SkillLabel } from '../types/Skill';
import { WeaponType, WeaponTypeLabel } from '../types/WeaponType';
import { ArmorType, ArmorTypeLabel } from '../types/ArmorType';
import { Tool, ToolLabel } from '../types/Tool';
import {
  HeroOption,
  HeroOptionsContainer,
  FixedHeroOption,
  MultiHeroOption,
  SelectableHeroOption,
  HiddenHeroOption,
} from '../HeroOption';
import { AbilityScore, AbilityScoreLabel } from '../types/AbilityScore';

type updateMethodType = () => HeroOption[] | HeroOptionsContainer[];
type KeyValue = { key: string; value: string };

class _Race extends Step {
  races?: Race[];
  race!: Race;

  $context!: JQuery;

  constructor() {
    super(StepEnum.Race);
  }

  section = () => $('#raceDiv');

  setListeners(): void {
    this.$context = $('[data-hct_race_data]');
    $('[data-hct_race_picker]').on('change', async (event) => {
      const raceName = $(event.currentTarget).val();
      if (this.races) {
        this.race = this.races.filter((r) => r.name === raceName)[0];
        const raceItem = await this.race.item;
        this.clearOptions();
        this.updateValuesForRace(raceItem);
      } else ui.notifications!.error(game.i18n.localize('HCT.Race.UpdateValueLoadError'));
    });
  }

  setSourceData(races: Race[]): void {
    this.races = races;
  }

  renderData(): void {
    $('[data-hct_race_data]').hide();
    if (this.races) setRaceOptions(this.races);
    else ui.notifications!.error(game.i18n.localize('HCT.Race.RenderLoadError'));
  }

  updateValuesForRace(raceItem: any) {
    $('[data-hct_race_area]').each((i, area) => {
      const $area = $(area).hide();
      const areaName = $area.data('hct_race_area') as string;
      const $section = $('section', area).empty();
      const updateMethod = (this as any)[`update${areaName.capitalize()}`].bind(this) as updateMethodType;
      const options = updateMethod();
      this.processOptions(options, $section);
      if (options && options.length) {
        $area.show();
      }
    });
    // Damage interactions
    // Condition interactions
    this.$context.show();

    this.stepOptions.push(new HiddenHeroOption(StepEnum.Race, 'raceItem', undefined, raceItem));
  }

  processOptions(options: HeroOption[] | HeroOptionsContainer[], $parent: JQuery) {
    for (const opt of options) {
      if (opt instanceof HeroOptionsContainer) {
        $parent.append(`<h3 class='race_proficiency_subtype'>${game.i18n.localize(opt.title)}</h3>`);
        this.processOptions(opt.options, $parent);
      } else {
        opt.render($parent);
        this.stepOptions.push(opt);
      }
    }
  }

  updateProficiencies(): HeroOptionsContainer[] {
    const profs = this.race.proficiencies;
    const containers: HeroOptionsContainer[] = [];
    if (!profs) return containers;

    for (const proficiencyKey of Object.keys(profs)) {
      const proficiencyType = (profs as any)[proficiencyKey];
      if (jQuery.isEmptyObject(proficiencyType)) continue;
      const container = new HeroOptionsContainer(getProficiencyTitle(proficiencyKey));
      containers.push(container);

      for (const modeKey of Object.keys(proficiencyType)) {
        const proficiency = (proficiencyType as any)[modeKey];
        if (!proficiency) continue;

        const value: any = getValuesForProficiency(modeKey, proficiencyKey, proficiency);
        const reviewTemplateKey =
          'skills' == proficiencyKey ? 'HCT.Race.ReviewTextProficiencySkill' : 'HCT.Race.ReviewTextProficiencyOthers';
        if (modeKey === 'fixed') {
          const formattedValue: string = !Array.isArray(value)
            ? value
            : (value as string[]).map((v) => v.capitalize()).join(', ');
          container.options.push(
            new FixedHeroOption(
              StepEnum.Race,
              `${proficiencyKey}.${modeKey}`,
              proficiency,
              formattedValue,
              game.i18n.format(reviewTemplateKey, { value: formattedValue }),
            ),
          );
        } else if (modeKey === 'any') {
          const anyOptions: KeyValue[] = getAnyOptionsForProficiencyType(proficiencyKey);
          if ((proficiency as number) > 1) {
            container.options.push(
              new MultiHeroOption(
                StepEnum.Race,
                'key',
                anyOptions,
                proficiency,
                game.i18n.localize('HCT.Race.ProficiencyMulti'),
                reviewTemplateKey,
              ),
            );
          } else {
            container.options.push(new SelectableHeroOption(StepEnum.Race, 'key', anyOptions, '', reviewTemplateKey));
          }
        } else if (modeKey === 'choose') {
          const choose: ChoosableChoice<any> = value as any;
          const selectableOptions: KeyValue[] = choose.options.map((opt: string) => ({
            key: opt,
            value: opt.capitalize(),
          }));
          if (choose.quantity > 1) {
            container.options.push(
              new MultiHeroOption(
                StepEnum.Race,
                `${proficiencyKey}.${modeKey}`,
                selectableOptions,
                choose.quantity,
                game.i18n.localize('HCT.Race.ProficiencyMulti'),
                reviewTemplateKey,
              ),
            );
          } else {
            container.options.push(
              new SelectableHeroOption(StepEnum.Race, 'key', selectableOptions, '', reviewTemplateKey),
            );
          }
        }
      }

      // DND5E.Languages
    }
    return containers;
  }

  updateMovement() {
    const mov: Movement = this.race.movement as Movement;
    if (!mov) return [];
    return Object.keys(mov).map(
      (key) =>
        new FixedHeroOption(
          StepEnum.Race,
          key,
          (mov as any)[key],
          game.i18n.localize(`DND5E.Movement${key.capitalize()}`) + ': ' + (mov as any)[key] + ' ft',
          game.i18n.format('HCT.Race.ReviewTextMovement', { value: (mov as any)[key] }),
        ),
    );
  }

  updateSenses(): HeroOption[] {
    const senses = this.race.senses;
    if (!senses) return [];
    return Object.keys(senses).map(
      (key) =>
        new FixedHeroOption(
          StepEnum.Race,
          key,
          (senses as any)[key],
          game.i18n.localize(`DND5E.Sense${key.capitalize()}`) + ': ' + (senses as any)[key] + ' ft',
          game.i18n.format('HCT.Race.ReviewTextSense', { key: key.capitalize(), value: (senses as any)[key] }),
        ),
    );
  }

  updateSize() {
    const size: Size = this.race.size as Size;
    if (!size) return [];
    const sizeText = `${game.i18n.localize(SizeLabel[size])}`;
    return [
      new FixedHeroOption(
        StepEnum.Race,
        'size',
        size,
        sizeText,
        game.i18n.format('HCT.Race.ReviewTextSize', { value: sizeText }),
      ),
    ];
  }

  updateAbilityScores() {
    const asis = this.race.abilityScoreImprovements;
    if (!asis) return [];
    const options: HeroOption[] = [];
    for (const key of Object.keys(asis)) {
      const asi: number = (asis as any)[key];
      if (Array.isArray(asi)) {
        const asiList: { key: string; value: string }[] = Object.values(AbilityScore).map((a) => ({
          key: a,
          value: game.i18n.localize(AbilityScoreLabel[a]),
        }));
        asi.forEach(() => {
          options.push(
            new SelectableHeroOption(
              StepEnum.Race,
              'key',
              asiList,
              Utils.getAbilityNameByKey(key),
              `${Utils.getAbilityNameByKey(key)}: ${Utils.modifierSign(asi)}`,
              true, // add this to abilities from Abilities tab
            ),
          );
        });
      } else {
        const text = `${Utils.getAbilityNameByKey(key)}: ${Utils.modifierSign(asi)}`;
        options.push(
          new FixedHeroOption(
            StepEnum.Race,
            `data.abilities.${(key as string).toLowerCase()}.value`,
            asi,
            text,
            text,
            true,
          ),
        );
      }
    }
    return options;
  }
}
const RaceTab: Step = new _Race();
export default RaceTab;

function getAnyOptionsForProficiencyType(proficiencyKey: string): KeyValue[] {
  let anyOptions: KeyValue[] = [];
  switch (proficiencyKey) {
    case 'skills':
      anyOptions = mapProficiency(Skill, SkillLabel);
      break;
    case 'weapons':
      anyOptions = mapProficiency(WeaponType, WeaponTypeLabel);
      break;
    case 'armor':
      anyOptions = mapProficiency(ArmorType, ArmorTypeLabel);
      break;
    case 'tools':
      anyOptions = mapProficiency(Tool, ToolLabel);
      break;
  }
  return anyOptions;
}

function getValuesForProficiency(modeKey: string, proficiencyKey: string, proficiency: any): any {
  switch (modeKey) {
    case 'fixed':
      return getFixedProficiency(proficiencyKey, modeKey, proficiency);
    case 'any':
      return getAnyProficiency(proficiencyKey, modeKey, proficiency);
    case 'choose':
      return getProficiencyChoices(proficiencyKey, modeKey, proficiency);
    default:
      const errMsg = game.i18n.format('HCT.Race.InvalidProfKeys', {
        modeKey: modeKey,
        proficiencyKey: proficiencyKey,
        proficiency: proficiency,
      });
      ui.notifications?.error(errMsg);
      throw new Error(errMsg);
  }
}

function mapProficiency(profEnum: any, enumLabel: any) {
  return Object.keys(profEnum).map((type) => ({
    key: profEnum[type],
    value: enumLabel[profEnum[type]],
  }));
}

function setRaceOptions(races: Race[]) {
  const picker = $('[data-hct_race_picker]');
  for (const race of races) {
    if (!race.parentRace) {
      // race is a primary race
      const subclasses = races.filter((r: Race) => r.parentRace == race);
      if (subclasses.length) {
        // race has classes - make an optgroup
        picker.append(
          $(`<optgroup class='hct_picker_primary hct_picker_primary_group' label='${race.name}'></optgroup>`),
        );
      } else {
        // race is standalone - make an option
        picker.append($(`<option class='hct_picker_primary' value='${race.name}'>${race.name}</option>`));
      }
    } else {
      // race is a subclass - find the parent and append to its optgroup
      $(`[label=${race.parentRace.name}]`, picker).append(
        $(`<option class='hct_picker_secondary' value='${race.name}'>${race.name}</option>`),
      );
    }
  }
}

function getFixedProficiency(typeKey: string, key: string, proficiency: any): any {
  let value;
  switch (typeKey) {
    case 'skills':
      value = SkillLabel[proficiency as Skill];
      break;
    case 'weapons':
      value = WeaponTypeLabel[proficiency as WeaponType];
      break;
    case 'armor':
      value = ArmorTypeLabel[proficiency as ArmorType];
      break;
    case 'tools':
      value = ToolLabel[proficiency as Tool];
      break;
    default:
      value = proficiency;
  }
  value = value === undefined ? proficiency : game.i18n.localize(value);
  return value;
}

function getAnyProficiency(typeKey: string, key: string, proficiency: any): any {
  let value;
  switch (typeKey) {
    case 'skills':
      value = SkillLabel[proficiency as Skill];
      break;
    case 'weapons':
      value = WeaponTypeLabel[proficiency as WeaponType];
      break;
    case 'armor':
      value = ArmorTypeLabel[proficiency as ArmorType];
      break;
    case 'tools':
      value = ToolLabel[proficiency as Tool];
      break;
    default:
      value = proficiency;
  }
  value = value === undefined ? proficiency : game.i18n.localize(value);
  //return [`${typeKey}.${key}.ANY`, value];
  return value;
}

function getProficiencyChoices(typeKey: string, key: string, proficiency: any): any {
  //return [`${typeKey}.${key}.${proficiency}.ANY`, proficiency];
  return proficiency;
}
function getProficiencyTitle(proficiencyKey: string): string {
  switch (proficiencyKey) {
    case 'skills':
      return 'HCT.Race.SkillProficiencies';
    case 'weapons':
      return 'DND5E.TraitWeaponProf';
    case 'armor':
      return 'DND5E.TraitArmorProf';
    case 'tools':
      return 'DND5E.TraitToolProf';
    default:
      return '';
  }
}

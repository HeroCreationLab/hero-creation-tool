/*
  Functions used exclusively on the Race tab
*/
import HeroData from '../types/ActorData';
import * as Constants from '../constants';
import { DataError } from '../types/DataError';
import { Step, StepEnum } from '../types/Step';
import Race, { Choosable, Movement } from '../types/Race';
import * as Utils from '../utils';
import { Size, SizeLabel } from '../types/Size';
import { Skill, SkillLabel } from '../types/Skill';
import { WeaponType, WeaponTypeLabel } from '../types/WeaponType';
import { ArmorType, ArmorTypeLabel } from '../types/ArmorType';
import { Tool, ToolLabel } from '../types/Tool';

class _Race extends Step {
  races?: Race[];

  constructor() {
    super(StepEnum.Race);
  }

  setListeners(): void {
    $('[data-hct_race_picker]').on('change', (event) => {
      const raceName = $(event.currentTarget).val();
      if (this.races) {
        const race = this.races.filter((r) => r.name === raceName)[0];
        updateValuesForRace(race);
      } else console.error('Races not loaded for updating values');
    });
  }

  setSourceData(races: Race[]): void {
    this.races = races;
  }

  renderData(): void {
    $('[data-hct_race_data]').hide();
    if (this.races) setRaceOptions(this.races);
    else console.error('Races not loaded for render data');
  }

  getErrors(): DataError[] {
    const errors: DataError[] = [];
    if (false) {
      errors.push(this.error('HCT.Err.Key'));
    }
    return errors;
  }

  saveActorData(newActor: HeroData): void {
    console.log(`${Constants.LOG_PREFIX} | Saving Race Tab data into actor`);

    // TBD
  }
}
const RaceTab: Step = new _Race();
export default RaceTab;

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

function updateValuesForRace(race: Race) {
  const $context = $('[data-hct_race_data]');

  updateAbilityScores();
  updateSize();
  updateSenses();
  updateMovement();
  updateProficiencies();

  // Damage interactions

  // Condition interactions

  $context.show();

  function updateProficiencies() {
    const $profSection = $('[data-hct_race_proficiencies]', $context);
    $profSection.empty();
    const profs = race.parentRace ? mergeProficiencies(race.parentRace, race) : race.proficiencies;
    const $elems: JQuery[] = [];
    for (const typeKey of Object.keys(profs)) {
      const proficiencyType = (profs as any)[typeKey];
      if (jQuery.isEmptyObject(proficiencyType)) continue;
      for (const key of Object.keys(proficiencyType)) {
        const proficiency = (proficiencyType as any)[key];
        if (!proficiency) continue;
        let prefix;
        let value;
        switch (key) {
          case 'fixed':
            [prefix, value] = getFixedProficiency(typeKey, key, proficiency);
            break;
          case 'any':
            [prefix, value] = getAnyProficiency(typeKey, key, proficiency);
            break;
          case 'choose':
            [prefix, value] = getProficiencyChoices(typeKey, key, proficiency);
            break;
        }
        /*
        const prefix = key == 'fixed' ? '' : typeKey + '.' + key;
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
        value = (value === undefined) ? proficiency : game.i18n.localize(value);
        */
        console.log(`
[${typeKey}].[${key}].[${proficiency}]
prefix[${prefix}]
value[${value}]
				`);
        $elems.push(
          $('<p>')
            .data({
              movement: proficiency,
            })
            .text(`${prefix ? game.i18n.localize(prefix) + ':' : ''} ${value}`),
        );
      }

      // DND5E.TraitArmorProf
      // DND5E.TraitToolProf
      // DND5E.TraitWeaponProf
      // DND5E.Languages
      // HCT.Race.SkillProficiencies
    }
    if ($elems.length) {
      $profSection.prev().show();
      $profSection.append($elems);
    } else {
      $profSection.prev().hide();
    }
  }

  function updateMovement() {
    const $movSection = $('[data-hct_race_movement]', $context);
    $movSection.empty();
    const mov: Movement = (race.parentRace
      ? { ...race.parentRace.movement, ...race.movement }
      : race.movement) as Movement;
    for (const key of Object.keys(mov)) {
      const moveMode = (mov as any)[key];
      $movSection.append(
        $('<p>')
          .data({
            movement: mov,
          })
          .text(`${game.i18n.localize('HCT.Common.Movement.' + key)} speed: ${moveMode}ft`),
      );
    }
  }

  function updateSenses() {
    const $sensesArea = $('[data-hct_race_senses_area]', $context);
    const $sensesSection = $('[data-hct_race_senses]', $context);
    $sensesSection.empty();
    const darkvision = race.darkvision ? race.darkvision : race.parentRace?.darkvision;
    if (darkvision) {
      $sensesSection.append(
        $('<p>')
          .data({
            darkvision: darkvision,
          })
          .text(`Darkvision: ${darkvision}ft`),
      );
      $sensesArea.show();
    } else {
      $sensesArea.hide();
    }
  }

  function updateSize() {
    const $sizeSection = $('[data-hct_race_size]', $context);
    $sizeSection.empty();
    const size: Size = (race.size ? race.size : race.parentRace?.size) as Size;
    $sizeSection.append(
      $('<p>')
        .data({
          size: size,
        })
        .text(`${game.i18n.localize(SizeLabel[size])}`),
    );
  }

  function updateAbilityScores() {
    const $asiSection = $('[data-hct_race_abilityScoreImprovements]', $context);
    $asiSection.empty();
    const asis = race.parentRace
      ? { ...race.parentRace.abilityScoreImprovements, ...race.abilityScoreImprovements }
      : race.abilityScoreImprovements;
    for (const key of Object.keys(asis)) {
      const asi = (asis as any)[key];
      const abilityText: string = Utils.getAbilityNameByKey(key);
      Array.isArray(asi.bonus)
        ? asi.bonus.map((a: number, index: number) =>
            $asiSection.append(
              $('<p>')
                .data({
                  hct_race_asi: `${key}${index}`,
                  hct_race_asi_bonus: asi.bonus,
                })
                .text(`${abilityText} +${a}`),
            ),
          )
        : $asiSection.append(
            $('<p>')
              .data({
                hct_race_asi: key,
                hct_race_asi_bonus: asi.bonus,
              })
              .text(`${abilityText} +${asi.bonus}`),
          );
    }
  }
}

function mergeProficiencies(parent: Race, child: Race) {
  return {
    skills: mergeChoosables(
      parent.proficiencies.skills as Choosable<Skill>,
      child.proficiencies.skills as Choosable<Skill>,
      'Skill',
    ),
    weapons: mergeChoosables(
      parent.proficiencies.weapons as Choosable<WeaponType>,
      child.proficiencies.weapons as Choosable<WeaponType>,
      'WeaponType',
    ),
    armor: mergeChoosables(
      parent.proficiencies.armor as Choosable<ArmorType>,
      child.proficiencies.armor as Choosable<ArmorType>,
      'ArmorType',
    ),
    tools: mergeChoosables(
      parent.proficiencies.tools as Choosable<Tool>,
      child.proficiencies.tools as Choosable<Tool>,
      'Tool',
    ),
  };
}

function mergeChoosables(parent: Choosable<any> = {}, child: Choosable<any> = {}, type: string) {
  const fixed = [...(parent.fixed ? parent.fixed : []), ...(child.fixed ? child.fixed : [])];
  const any = (parent.any ? parent.any : 0) + (child.any ? child.any : 0);
  const q = (parent.choose ? parent.choose.quantity : 0) + (child.choose ? child.choose.quantity : 0);
  const o = [...(parent.choose ? parent.choose.options : []), ...(child.choose ? child.choose.options : [])];
  const choose = q && o.length ? { quantity: q, options: o } : undefined;
  // TODO review this
  return {
    fixed: fixed.length ? fixed : undefined,
    any: any ? any : undefined,
    choose: choose ? choose : undefined,
  };
}

function getFixedProficiency(typeKey: string, key: string, proficiency: any): [string, string] {
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
  return ['', value];
}

function getAnyProficiency(typeKey: string, key: string, proficiency: any): [string, string] {
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
  return [`${typeKey}.${key}.ANY`, value];
}

function getProficiencyChoices(typeKey: string, key: string, proficiency: any): [string, string] {
  return [`${typeKey}.${key}.${proficiency}.ANY`, proficiency];
}

/*
  Functions used exclusively on the Race tab
*/
import { Step, StepEnum } from '../Step';
import Race, { getItemNames, Movement } from '../types/Race';
import * as Utils from '../utils';
import * as Constants from '../constants';
import { Size, SizeLabel } from '../types/Size';
import HeroOption from '../options/HeroOption';
import HiddenOption from '../options/HiddenOption';
import SelectableOption from '../options/SelectableOption';
import FixedOption, { OptionType } from '../options/FixedOption';
import OptionsContainer from '../options/OptionsContainer';
import * as DataPrep from '../dataPrep';
import { Ability, AbilityScoreLabel } from '../types/Ability';

type updateMethodType = () => HeroOption[] | OptionsContainer[];
//type KeyValue = { key: string; value: string };

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
        const resolvedRaceItems = await Promise.all(
          getItemNames(this.race).map((itemName) => {
            return Utils.getItemFromCompendiumByName(Constants.DND5E_COMPENDIUMS.RACES, itemName);
          }),
        );
        this.updateValuesForRace(raceName as string, resolvedRaceItems);

        // update icon and description
        const c = resolvedRaceItems[resolvedRaceItems.length - 1];
        $('[data-hct_race_icon]').attr('src', c.img);
        $('[data-hct_race_description]').html(TextEditor.enrichHTML((c.data as any).description.value));
      } else ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Races' }));
    });
  }

  async setSourceData() {
    this.races = await DataPrep.setupRaces();
  }

  renderData(): void {
    $('[data-hct_race_data]').hide();
    if (this.races) setRaceOptions(this.races);
    else ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Races' }));
  }

  updateValuesForRace(raceName: string, raceItems: any[]) {
    this.clearOptions();
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

    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'items', raceItems, { addValues: true }));
    this.stepOptions.push(new HiddenOption(StepEnum.Race, 'data.details.race', raceName));
  }

  processOptions(options: HeroOption[] | OptionsContainer[], $parent: JQuery) {
    for (const opt of options) {
      if (opt instanceof OptionsContainer) {
        $parent.append(`<h3 class='race_proficiency_subtype'>${game.i18n.localize(opt.title)}</h3>`);
        this.processOptions(opt.options, $parent);
      } else {
        opt.render($parent);
        this.stepOptions.push(opt);
      }
    }
  }

  updateProficiencies(): OptionsContainer[] {
    // FIXME do proficiencies later
    const container = new OptionsContainer('SOON..');
    return [container];
    // const profs = this.race.proficiencies;
    // const containers: HeroOptionsContainer[] = [];
    // if (!profs) return containers;
    // console.log(profs);

    // for (const proficiencyKey of Object.keys(profs)) {
    //   const proficiencyType = (profs as any)[proficiencyKey];
    //   if (jQuery.isEmptyObject(proficiencyType)) continue;
    //   const container = new HeroOptionsContainer(getProficiencyContainerTitle(proficiencyKey));
    //   containers.push(container);

    //   for (const modeKey of Object.keys(proficiencyType)) {
    //     const proficiency = (proficiencyType as any)[modeKey];
    //     if (!proficiency) continue;

    //     const value: any = getValuesForProficiency(modeKey, proficiencyKey, proficiency);
    //     if (modeKey === 'fixed') {
    //       const formattedValue: string = !Array.isArray(value)
    //         ? value
    //         : (value as string[]).map((v) => getProficiencyName(proficiencyKey, v)).map((v) => v.capitalize()).join(', ');
    //       container.options.push(
    //         new FixedHeroOption(
    //           StepEnum.Race,
    //           getActorKeyForProficiency(proficiencyKey, proficiency),
    //           proficiency,
    //           formattedValue,
    //         ),
    //       );
    //     } else if (modeKey === 'any') {
    //       const anyOptions: KeyValue[] = getAnyOptionsForProficiencyType(proficiencyKey);
    //       if ((proficiency as number) > 1) {
    //         container.options.push(
    //           new MultiHeroOption(
    //             StepEnum.Race,
    //             getActorKeyForProficiency(proficiencyKey, proficiency),
    //             anyOptions,
    //             proficiency,
    //             game.i18n.localize('HCT.Common.ProficiencyMulti'),
    //           ),
    //         );
    //       } else {
    //         container.options.push(new SelectableHeroOption(
    //           StepEnum.Race,
    //           getActorKeyForProficiency(proficiencyKey, proficiency),
    //           anyOptions,
    //           ''
    //         ));
    //       }
    //     } else if (modeKey === 'choose') {
    //       const choose: ChoosableChoice<any> = value as any;
    //       const selectableOptions: KeyValue[] = choose.options.custom!.map((opt: string) => ({
    //         key: opt,
    //         value: opt.capitalize(),
    //       }));
    //       if (choose.quantity > 1) {
    //         container.options.push(
    //           new MultiHeroOption(
    //             StepEnum.Race,
    //             getActorKeyForProficiency(proficiencyKey, proficiency),
    //             selectableOptions,
    //             choose.quantity,
    //             game.i18n.localize('HCT.Common.ProficiencyMulti'),
    //           ),
    //         );
    //       } else {
    //         container.options.push(new SelectableHeroOption(
    //           StepEnum.Race,
    //           getActorKeyForProficiency(proficiencyKey, proficiency),
    //           selectableOptions,
    //           ''
    //         ));
    //       }
    //     }
    //   }

    //   // DND5E.Languages
    // }
    // return containers;
  }

  updateMovement() {
    const mov: Movement = this.race.movement as Movement;
    if (!mov) return [];
    return Object.keys(mov).map(
      (key) =>
        new FixedOption(
          StepEnum.Race,
          `data.attributes.movement.${key}`,
          (mov as any)[key],
          game.i18n.localize(`DND5E.Movement${key.capitalize()}`) + ': ' + (mov as any)[key] + ' ft',
        ),
    );
  }

  updateSenses(): HeroOption[] {
    const senses = this.race.senses;
    if (!senses) return [];
    return Object.keys(senses).map(
      (key) =>
        new FixedOption(
          StepEnum.Race,
          `data.attributes.senses.${key}`,
          (senses as any)[key],
          game.i18n.localize(`DND5E.Sense${key.capitalize()}`) + ': ' + (senses as any)[key] + ' ft',
        ),
    );
  }

  updateSize() {
    const size: Size = this.race.size as Size;
    if (!size) return [];
    const sizeText = `${game.i18n.localize(SizeLabel[size])}`;
    return [new FixedOption(StepEnum.Race, 'data.traits.size', size, sizeText)];
  }

  updateAbilityScores() {
    const asis = this.race.abilityScoreImprovements;
    if (!asis) return [];
    const options: HeroOption[] = [];
    for (const key of Object.keys(asis)) {
      const asi: number = (asis as any)[key];
      if (Array.isArray(asi)) {
        const asiList: { key: string; value: string }[] = Object.values(Ability).map((a) => ({
          key: a,
          value: game.i18n.localize(AbilityScoreLabel[a]),
        }));
        asi.forEach(() => {
          options.push(
            new SelectableOption(StepEnum.Race, 'key', asiList, Utils.getAbilityNameByKey(key), { addValues: true }),
          );
        });
      } else {
        const text = `${Utils.getAbilityNameByKey(key)}: ${Utils.modifierSign(asi)}`;
        options.push(
          new FixedOption(StepEnum.Race, `data.abilities.${(key as string).toLowerCase()}.value`, asi, text, {
            addValues: true,
            type: OptionType.TEXT,
          }),
        );
      }
    }
    return options;
  }
}
const RaceTab: Step = new _Race();
export default RaceTab;

// function getAnyOptionsForProficiencyType(proficiencyKey: string): KeyValue[] {
//   let anyOptions: KeyValue[] = [];
//   switch (proficiencyKey) {
//     case 'skills':
//       anyOptions = mapProficiency(Skill, SkillLabel);
//       break;
//     case 'weapons':
//       anyOptions = mapProficiency(WeaponType, WeaponTypeLabel);
//       break;
//     case 'armor':
//       anyOptions = mapProficiency(ArmorType, ArmorTypeLabel);
//       break;
//     case 'tools':
//       anyOptions = mapProficiency(Tool, ToolLabel);
//       break;
//   }
//   return anyOptions;
// }

// function getValuesForProficiency(modeKey: string, proficiencyKey: string, proficiency: any): any {
//   switch (modeKey) {
//     case 'fixed':
//     case 'any':
//     case 'choose':
//       return getProficiencyName(proficiencyKey, proficiency);
//     default:
//       const errMsg = game.i18n.format('HCT.Race.InvalidProfKeys', {
//         modeKey: modeKey,
//         proficiencyKey: proficiencyKey,
//         proficiency: proficiency,
//       });
//       ui.notifications?.error(errMsg);
//       throw new Error(errMsg);
//   }
// }

// function mapProficiency(profEnum: any, enumLabel: any) {
//   return Object.keys(profEnum).map((type) => ({
//     key: profEnum[type],
//     value: enumLabel[profEnum[type]],
//   }));
// }

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

// function getProficiencyName(typeKey: string, proficiency: any): any {
//   let value;
//   switch (typeKey) {
//     case 'skills':
//       value = SkillLabel[proficiency as Skill];
//       break;
//     case 'weapons':
//       value = WeaponTypeLabel[proficiency as WeaponType];
//       break;
//     case 'armor':
//       value = ArmorTypeLabel[proficiency as ArmorType];
//       break;
//     case 'tools':
//       value = ToolLabel[proficiency as Tool];
//       break;
//     default:
//       value = proficiency;
//   }
//   value = value === undefined ? proficiency : game.i18n.localize(value);
//   return value;
// }

// function getProficiencyContainerTitle(proficiencyKey: string): string {
//   switch (proficiencyKey) {
//     case 'skills':
//       return 'HCT.Race.SkillProficiencies';
//     case 'weapons':
//       return 'DND5E.TraitWeaponProf';
//     case 'armor':
//       return 'DND5E.TraitArmorProf';
//     case 'tools':
//       return 'DND5E.TraitToolProf';
//     default:
//       return '';
//   }
// }

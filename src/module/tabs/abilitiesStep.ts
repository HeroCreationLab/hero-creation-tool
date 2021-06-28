/*
  Functions used exclusively on the Abilities tab
*/
import HeroData from '../HeroData';
import * as Constants from '../constants';
import * as Utils from '../utils';
import { Step, StepEnum } from '../Step';
import { FixedHeroOption, HeroOption } from '../HeroOption';

class _Abilities extends Step {
  constructor() {
    super(StepEnum.Abilities);
  }

  section = () => $('#abDiv');

  setListeners(): void {
    // entry mode
    $('[data-mode]').on('click', function () {
      const mode = $(this).data('mode');
      switch (mode) {
        case 'roll':
          rollAbilities();
          break;
        case 'standard':
          prepareStandardArray();
          break;
        case 'point-buy':
          preparePointBuy();
          break;
        case 'manual':
          manualAbilities();
          break;
      }
    });

    // for point buy and manual entry
    $('.abilityUp').on('click', (ev) => {
      const stat = ev.currentTarget.id;
      const i = stat.charAt(stat.length - 1);
      increaseAbility(i);
    });
    $('.abilityDown').on('click', (ev) => {
      const stat = ev.currentTarget.id;
      const i = stat.charAt(stat.length - 1);
      decreaseAbility(i);
    });

    $('#ability-desc-accordion').on('click', function () {
      $('#abilities-info').toggle();
    });

    // table
    $('#ability-mod-table-toggle').on('click', function () {
      $('#ability-scores-modes-table').toggle();
    });
  }

  setSourceData(): void {
    /* IMPLEMENT AS NEEDED */
  }

  renderData(): void {
    /* IMPLEMENT AS NEEDED */
  }

  getOptions(): HeroOption[] {
    this.clearOptions();
    for (let i = 1; i < 7; i++) {
      const $input: JQuery = $(`#number${i}`, this.section());
      const $select: JQuery = $(`#stat${i}`, this.section());
      const asiKey = ($select.val() as string)?.toLowerCase();
      if (asiKey) {
        const key = `data.abilities.${asiKey}.value`;
        const asiValue: number = Number.parseInt($input.val() as string);
        const textToShow = `${Utils.getAbilityNameByKey(asiKey)}: ${asiValue}`;
        this.stepOptions.push(new FixedHeroOption(this.step, key, asiValue, textToShow, true));
      }
    }
    return this.stepOptions;
  }

  getHeroOptions(newActor: HeroData) {
    console.log(`${Constants.LOG_PREFIX} | Saving Abilities Tab data into actor`);

    const values: number[] = [];
    const stats: string[] = [];
    for (let i = 0; i < 6; i++) {
      // Getting the stat
      values[i] = $(`#number${i + 1}`).val() as number;
      // Getting the type of stat
      stats.push($(`#stat${i + 1}`).val() as string);
    }

    newActor.data = { abilities: {} } as any;
    for (let i = 0; i < stats.length; i++) {
      // Push abilities into the newActor object data
      const stat = stats[i].toLowerCase();
      if (newActor.data) {
        (newActor.data.abilities as any)[`${stat}`] = { value: values[i] };
      }
    }
  }
}
const AbilitiesTab: Step = new _Abilities();
export default AbilitiesTab;

// TODO see if we incorporate this or not

// function statsDuplicatedOrMissing() {
//   /**Check that there are no repeats */
//   const stats: string[] = [];
//   for (let i = 0; i < 6; i++) {
//     stats.push($(`#stat${i + 1}`).val() as string);
//   }
//   for (let x = 0; x < stats.length; x++) {
//     for (let y = 0; y < stats.length; y++) {
//       if (!stats[x]) {
//         return true;
//       }
//       if (x != y && stats[x] == stats[y]) {
//         return true;
//       }
//     }
//   }
//   return false;
// }

async function rollAbilities() {
  const values = [];
  for (let i = 0; i < 6; i++) {
    const roll = await new Roll('4d6kh3').evaluate({ async: true } as any);
    values.push(roll.total);
  }

  toggleAbilitySelects(true, false);
  toggleAbilityInputs(false);
  togglePointBuyScore(false);
  toggleAbilityUpDownButtons(false, false);
  setAbilityInputs(values as any);
  updateAbilityModifiers();
}

function prepareStandardArray() {
  const values = [15, 14, 13, 12, 10, 8];
  toggleAbilitySelects(false, false); // JUST FOR TEST
  //toggleAbilitySelects(true, true);
  toggleAbilityInputs(false);
  togglePointBuyScore(false);
  toggleAbilityUpDownButtons(false, false);
  setAbilityInputs(values);
  updateAbilityModifiers();
}

function preparePointBuy() {
  toggleAbilitySelects(false, false);
  toggleAbilityInputs(false);
  togglePointBuyScore(true);
  toggleAbilityUpDownButtons(true, false);
  setAbilityInputs(8);
  updateAbilityModifiers();
}

function manualAbilities() {
  toggleAbilitySelects(false, false);
  toggleAbilityInputs(true);
  togglePointBuyScore(false);
  toggleAbilityUpDownButtons(true, true);
  setAbilityInputs(10);
  updateAbilityModifiers();
}

function togglePointBuyScore(isPointBuy: boolean) {
  (document.getElementById('point-buy-current-score') as any).innerHTML = '0';
  (document.getElementById('point-buy-score') as any).hidden = !isPointBuy;
}

function changeAbility(i: string, up: boolean) {
  const stat = $('#number' + i) as any;
  const value = parseInt(stat.val());
  const isPointBuy = $('#point-buy-score').is(':visible');
  const newValue = value + (up ? 1 : -1);

  stat.val(newValue + '');

  if (isPointBuy) {
    const cost = (up && value > 12) || (!up && value > 13) ? 2 : 1;
    const currentPointsElement: any = document.getElementById('point-buy-current-score');
    const currentPoints = parseInt(currentPointsElement.innerHTML);
    const maxPoints = parseInt((document.getElementById('point-buy-max-score') as any).innerHTML);
    const newPoints = up ? currentPoints + cost : currentPoints - cost;
    currentPointsElement.innerHTML = newPoints + '';

    for (let j = 1; j < 7; j++) {
      const value = parseInt($('#number' + j).val() as string);
      const disableUp = newPoints >= maxPoints || value == 15;
      const disableDown = value == 8;
      $('#up' + j).prop('disabled', disableUp);
      $('#down' + j).prop('disabled', disableDown);
    }
    if (newPoints > maxPoints) alert(game.i18n.localize('HCT.Abitilies.PointBuyOverLimit'));
  } else {
    if (newValue == 20) {
      $('#up' + i).prop('disabled', true);
    } else if (newValue == 0) {
      $('#down' + i).prop('disabled', true);
    } else {
      $('#up' + i).prop('disabled', false);
      $('#down' + i).prop('disabled', false);
    }
  }
  updateAbilityModifiers();
}

function increaseAbility(i: string) {
  changeAbility(i, true);
}

function decreaseAbility(i: string) {
  changeAbility(i, false);
}

function setAbilityInputs(values: number | Array<number>) {
  for (let i = 0; i < 6; i++) {
    $('#number' + (i + 1)).val(Array.isArray(values) ? values[i] : values);
  }
}

function toggleAbilitySelects(enable: boolean, resetSelects: boolean) {
  for (let i = 0; i < 6; i++) {
    $('#stat' + (i + 1)).prop('disabled', !enable);
  }
  if (resetSelects) {
    for (let i = 0; i < 6; i++) {
      $('#stat' + (i + 1)).val('');
    }
  } else {
    $('#stat1').val('STR');
    $('#stat2').val('DEX');
    $('#stat3').val('CON');
    $('#stat4').val('INT');
    $('#stat5').val('WIS');
    $('#stat6').val('CHA');
  }
}

function toggleAbilityInputs(enable: boolean) {
  for (let i = 0; i < 6; i++) {
    $('#number' + (i + 1)).prop('disabled', !enable);
  }
}

function toggleAbilityUpDownButtons(show: boolean, enableDown: boolean) {
  for (let i = 0; i < 6; i++) {
    const n = i + 1;
    $('#up' + n).prop('disabled', false);
    $('#down' + n).prop('disabled', !enableDown);
    if (show) {
      $('#up' + n).show();
      $('#down' + n).show();
    } else {
      $('#up' + n).hide();
      $('#down' + n).hide();
    }
  }
}

function updateAbilityModifiers() {
  for (let i = 0; i < 6; i++) {
    const num = parseInt($('#number' + (i + 1)).val() as string);
    const mod = Math.floor((num - 10) / 2);
    const id = 'mod' + (i + 1);
    (document.getElementById(id) as any).innerHTML = (mod >= 0 ? '+' + mod : mod) + '';
  }
}

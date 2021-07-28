/*
  Functions used exclusively on the Abilities tab
*/
import * as Constants from '../constants';
import * as Utils from '../utils';
import { Step, StepEnum } from '../Step';
import HeroOption from '../options/HeroOption';
import FixedOption, { OptionType } from '../options/FixedOption';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import SettingKeys from '../settings';

class _Abilities extends Step {
  constructor() {
    super(StepEnum.Abilities);
  }

  touched!: boolean;

  section = () => $('#abDiv');

  setListeners(): void {
    // entry mode
    $('[data-mode]').on('click', (event) => {
      this.touched = true;
      const mode = $(event.target).data('mode');
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
    $('[data-hct-abilities-up]').on('click', (ev) => increaseAbility($(ev.target).data('hct-abilities-up')));
    $('[data-hct-abilities-down]').on('click', (ev) => decreaseAbility($(ev.target).data('hct-abilities-down')));
  }

  async renderData() {
    // Show rules on the side panel
    const abilitiesRulesItem = await Utils.getJournalFromPackByName(
      Constants.DEFAULT_PACKS.RULES,
      Constants.RULES.ABILITIES,
    );
    $('[data-hct_abilities_description]', this.section()).html(
      TextEditor.enrichHTML((abilitiesRulesItem as any).content),
    );

    this.touched = false;
  }

  getOptions(): HeroOption[] {
    this.clearOptions();
    if (this.touched && statsDuplicatedOrMissing()) {
      ui.notifications?.error(game.i18n.localize('HCT.Abilities.NotAllSixAbilities'));
      throw new Error('Invalid abilities');
    }

    const foundryAbilities = (game as any).dnd5e.config.abilities;
    for (let i = 1; i < 7; i++) {
      const $input: JQuery = $(`#number${i}`, this.section());
      const $select: JQuery = $(`#stat${i}`, this.section());
      const asiKey = ($select.val() as string)?.toLowerCase();
      if (asiKey) {
        const key = `data.abilities.${asiKey}.value`;
        const asiValue: number = Number.parseInt($input.val() as string);
        const textToShow = `${foundryAbilities[asiKey]}: ${asiValue}`;
        this.stepOptions.push(
          new FixedOption(this.step, key, asiValue, textToShow, { addValues: true, type: OptionType.NUMBER }),
        );
      }
    }
    if (this.stepOptions.length == 0) {
      // default abilities
      Object.keys(foundryAbilities).forEach((asi) => {
        const defaultAsi = 10;
        const textToShow = `${foundryAbilities[asi]}: ${defaultAsi}`;
        this.stepOptions.push(
          new FixedOption(this.step, `data.abilities.${asi}.value`, defaultAsi, textToShow, {
            addValues: true,
            type: OptionType.NUMBER,
          }),
        );
      });
    }
    return this.stepOptions;
  }

  getHeroOptions(newActor: ActorDataConstructorData) {
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
        (newActor.data as any).abilities[`${stat}`] = { value: values[i] };
      }
    }
  }
}
const AbilitiesTab: Step = new _Abilities();
export default AbilitiesTab;

function statsDuplicatedOrMissing() {
  /**Check that there are no repeats */
  const stats: string[] = [];
  for (let i = 0; i < 6; i++) {
    stats.push($(`#stat${i + 1}`).val() as string);
  }
  for (let x = 0; x < stats.length; x++) {
    for (let y = 0; y < stats.length; y++) {
      if (!stats[x]) {
        return true;
      }
      if (x != y && stats[x] == stats[y]) {
        return true;
      }
    }
  }
  return false;
}

async function rollAbilities() {
  const roll = await new Roll('4d6kh3 + 4d6kh3 + 4d6kh3 + 4d6kh3 + 4d6kh3 + 4d6kh3').evaluate({ async: true });
  if (Utils.getModuleSetting(SettingKeys.SHOW_ROLLS_AS_MESSAGES)) {
    roll.toMessage({ flavor: game.i18n.localize('HCT.Abilities.RollChatFlavor') });
  }
  const values: number[] = roll.result.split('+').map((r) => Number.parseInt(r.trim()));

  toggleAbilitySelects(true, false);
  toggleAbilityInputs(false);
  togglePointBuyScore(false);
  toggleAbilityUpDownButtons(false, false);
  setAbilityInputs(values as any);
  updateAbilityModifiers();
}

function prepareStandardArray() {
  const values = [15, 14, 13, 12, 10, 8];
  toggleAbilitySelects(true, true);
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
  $('[data-hct-point-buy]').toggle(isPointBuy);
  $('[data-hct-point-buy-score]').html('0');
}

function changeAbility(i: string, up: boolean) {
  const stat = $('#number' + i) as any;
  const value = parseInt(stat.val());
  const isPointBuy = $('[data-hct-point-buy]').is(':visible');
  const newValue = value + (up ? 1 : -1);

  stat.val(newValue + '');

  if (isPointBuy) {
    const cost = (up && value > 12) || (!up && value > 13) ? 2 : 1;
    const $currentPoints: JQuery = $('[data-hct-point-buy-score]');
    const currentPoints = parseInt($currentPoints.html());
    const maxPoints = parseInt($('[data-hct-point-buy-max]').html());
    const newPoints = up ? currentPoints + cost : currentPoints - cost;
    $currentPoints.html(newPoints + '');

    for (let j = 1; j < 7; j++) {
      const value = parseInt($('#number' + j).val() as string);
      const disableUp = newPoints >= maxPoints || value == 15;
      const disableDown = value == 8;
      $('#up' + j).prop('disabled', disableUp);
      $('#down' + j).prop('disabled', disableDown);
    }
    if (newPoints > maxPoints) alert(game.i18n.localize('HCT.Abitilies.PointBuy.OverLimit'));
  } else {
    if (newValue == 20) {
      $('#up' + i).prop('disabled', true);
    } else if (newValue == 1) {
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
    const mod = Utils.getAbilityModifierValue(num);
    const id = 'mod' + (i + 1);
    (document.getElementById(id) as any).innerHTML = (mod >= 0 ? '+' + mod : mod) + '';
  }
}

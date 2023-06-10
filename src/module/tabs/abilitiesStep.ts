import { Step, StepEnum } from '../step';
import HeroOption from '../options/heroOption';
import FixedOption, { OptionType } from '../options/fixedOption';
import SettingKeys from '../settings';
// import { getRuleJournalEntryByName } from '../indexes/indexUtils';
import { getAbilityModifierValue, getModuleSetting, getRules, localize, setPanelScrolls } from '../utils';

const enum EntryMode {
  ROLL = 'roll',
  STANDARD_ARRAY = 'standard',
  POINT_BUY = 'point-buy',
  MANUAL_ENTRY = 'manual',
}

const STANDARD_ARRAY = [15, 14, 13, 12, 10, 8];

const rules = { journalId: '0AGfrwZRzSG0vNKb', pageId: 'yuSwUFIjK31Mr3DI' };

class _Abilities extends Step {
  constructor() {
    super(StepEnum.Abilities);
  }

  section = () => $('#abDiv');

  possibleValues: number[] = [];

  pointBuy = false;

  async setListeners() {
    // entry mode
    $('[data-mode]', this.section).on('click', async (event) => {
      const mode = $(event.target).data('mode');

      this.possibleValues = [];
      switch (mode) {
        case EntryMode.ROLL:
          this.possibleValues = await prepareRolls();
          break;
        case EntryMode.STANDARD_ARRAY:
          this.possibleValues = getStandardArray();
          break;
        case EntryMode.POINT_BUY:
          this.possibleValues = [15, 14, 13, 12, 11, 10, 9, 8];
          $('[data-hct-point-buy-score]').val(0); // reset current score
          break;
        case EntryMode.MANUAL_ENTRY:
          this.possibleValues = [20, 19, 18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
          break;
      }
      // handle Point Buy specifics
      $('[data-hct-point-buy]', this.section).toggle(mode == EntryMode.POINT_BUY);
      this.pointBuy = mode == EntryMode.POINT_BUY;

      fillAbilitySelects(this.possibleValues, this.section, this.pointBuy);
      recalculateTotalsAndModifiers(this.pointBuy);
    });

    //update values when an ability select is changed
    $('[data-hct-ability-score]', this.section).on('change', (e) => recalculateTotalsAndModifiers(this.pointBuy));
  }

  async renderData() {
    setPanelScrolls(this.section());

    // Enable only DM-allowed methods
    const $methodsContext = $('[data-hct-ability-methods]', this.section);
    $('[data-mode="roll"]', $methodsContext).prop('disabled', !getModuleSetting(SettingKeys.ENABLE_ASI_ROLL));
    $('[data-mode="standard"]', $methodsContext).prop('disabled', !getModuleSetting(SettingKeys.ENABLE_ASI_STANDARD));
    $('[data-mode="point-buy"]', $methodsContext).prop('disabled', !getModuleSetting(SettingKeys.ENABLE_ASI_POINTBUY));
    $('[data-mode="manual"]', $methodsContext).prop('disabled', !getModuleSetting(SettingKeys.ENABLE_ASI_MANUAL));

    // set proper dice to the Roll button
    const dice = game.i18n.format('HCT.Abilities.Buttons.Roll', {
      dice: getModuleSetting(SettingKeys.ABILITY_ROLL_FORMULA),
    });
    $('[data-mode="roll"]', $methodsContext).html(dice);

    // Show rules on the side panel
    const abilityRules = await getRules(rules);
    if (abilityRules) {
      $('[data-hct_abilities_description]', this.section()).html(
        //@ts-expect-error TextEditor TS def not updated yet
        await TextEditor.enrichHTML(abilityRules.content, { async: true }),
      );
    }

    // setting default values
    const $selects = $('[data-hct-ability-score]', this.section);
    $selects.append($(`<option value=10>10</option>`));

    // set pointbuy max and score
    const pointBuyMax = getModuleSetting(SettingKeys.POINT_BUY_LIMIT) as number;
    $('[data-hct-point-buy-max]').val(pointBuyMax);
  }

  update() {
    const $raceStats = $('[data-hct-race-ability]');
    if ($raceStats.length == 0) {
      $(`[data-hct-ability-score-race-bonus]`).val(0).html('+0');
    } else {
      $raceStats.each((i, e) => {
        const ability = e.dataset.hctRaceAbility;
        const value = (e as HTMLInputElement).value !== '' ? (e as HTMLInputElement).value : '0';
        $(`[data-hct-ability-score-race-bonus=${ability}]`)
          .val(value)
          .html(value.startsWith('-') ? value : '+' + value);
      });
    }
    recalculateTotalsAndModifiers(this.pointBuy);
  }

  getOptions(): HeroOption[] {
    this.clearOptions();

    $('[data-hct-ability-score]', this.section).each((i, e) => {
      const ability = e.dataset.hctAbilityScore;
      const value = (e as HTMLOptionElement).value;
      if (ability && value) {
        this.stepOptions.push(
          new FixedOption(this.step, `data.abilities.${ability}.value`, value, 'UNUSED', {
            addValues: true,
            type: OptionType.NUMBER,
          }),
        );
      }
    });
    return this.stepOptions;
  }
}
const AbilitiesTab: Step = new _Abilities();
export default AbilitiesTab;

function getStandardArray(): number[] {
  const arrayAsString = getModuleSetting(SettingKeys.ABILITY_ARRAY) as string;
  try {
    const customArray = arrayAsString.split(';').map((s) => Number(s.trim()));
    if (customArray.length !== 6) throw new Error(localize('Setting.AbilityArray.WrongSizeError'));
    return customArray;
  } catch (err) {
    ui.notifications?.error(localize('Setting.AbilityArray.GenericError', { values: STANDARD_ARRAY }));
    console.error(err);
    return STANDARD_ARRAY;
  }
}

async function prepareRolls() {
  const abilityRoll = getModuleSetting(SettingKeys.ABILITY_ROLL_FORMULA) as string;
  const roll = await new Roll(
    `${abilityRoll} + ${abilityRoll} + ${abilityRoll} + ${abilityRoll} + ${abilityRoll} + ${abilityRoll}`,
  ).evaluate({ async: true });
  if (getModuleSetting(SettingKeys.SHOW_ROLLS_AS_MESSAGES)) {
    roll.toMessage({ flavor: game.i18n.localize('HCT.Abilities.RollChatFlavor') });
  }
  return roll.result
    .split('+')
    .map((r) => Number.parseInt(r.trim()))
    .sort((a: number, b: number) => b - a);
}

function fillAbilitySelects(possibleValues: number[], $section: any, isPointBuy: boolean) {
  const $selects = $('[data-hct-ability-score]', $section);
  $selects.empty();
  if (!isPointBuy) {
    $selects.append(
      $(
        `<option selected="true" disabled="disabled">${game.i18n.localize('HCT.Abilities.SelectPlaceholder')}</option>`,
      ),
    );
  }
  possibleValues.forEach((v) => {
    const opt = $(`<option value='${v}' ${isPointBuy && v == 8 ? 'selected' : ''}>${v}</option>`);
    $selects.append(opt);
  });
}

function recalculateTotalsAndModifiers(isPointBuy: boolean) {
  const abilities = Object.keys((game as any).dnd5e.config.abilities);
  let points = 0;
  abilities.forEach((ab) => {
    const score = parseInt(($(`[data-hct-ability-score='${ab}']`).val() as string) ?? 10);
    const race = parseInt($(`[data-hct-ability-score-race-bonus='${ab}']`).val() as string);
    const $total = $(`[data-hct-ability-score-total='${ab}']`);
    const $mod = $(`[data-hct-ability-score-mod='${ab}']`);

    const total = score + race;
    $total.val(total).html(total + '');
    const modifier = getAbilityModifierValue(total);
    $mod.html((modifier < 0 ? '' : '+') + modifier);

    if (isPointBuy) {
      points += getPointBuyCost(score);
    }
  });
  if (isPointBuy) {
    $('[data-hct-point-buy-score]').val(points);
  }
}

function getPointBuyCost(score: number) {
  if (score < 14) return score - 8;
  return (score - 13) * 2 + 5;
}

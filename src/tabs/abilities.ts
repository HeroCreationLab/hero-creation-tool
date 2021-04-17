/*
  Functions used exclusively on the Abilities tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataTab } from '../types/DataTab.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Abilities extends Step implements DataTab {
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

        // infoToggle
        $('#ability-desc-accordion').on('click', function () {
            toggleVisibility('abilities-info');
        });

        // table
        $('#ability-mod-table-toggle').on('click', function () {
            toggleVisibility('ability-scores-modes-table');
        });
    }

    getErrors(): DataError[] {
        const errors: DataError[] = [];
        if (statsDuplicatedOrMissing()) {
            errors.push(this.error("HCT.Abitilies.NotAllSix"));
        }
        return errors;
    }

    saveData(newActor: HeroData) {
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
        for (var i = 0; i < stats.length; i++) {
            // Push abilities into the newActor object data
            const stat = stats[i].toLowerCase();
            (newActor.data.abilities as any)[`${stat}`] = { value: values[i] };
        }
    }
}
const AbilitiesTab: DataTab = new _Abilities(StepEnum.Abilities);
export default AbilitiesTab;

function statsDuplicatedOrMissing() {
    /**Check that there are no repeats */
    const stats: string[] = [];
    for (let i = 0; i < 6; i++) {
        stats.push($(`#stat${i + 1}`).val() as string);
    }
    for (var x = 0; x < stats.length; x++) {
        for (var y = 0; y < stats.length; y++) {
            if (!stats[x]) {
                return true;
            }
            if (stats[x] == stats[y] && x != y) {
                return true;
            }
        }
    }
    return false;
}

function toggleVisibility(id: string) {
    const elem = $(`#${id}`);
    if (elem.is(':visible')) {
        elem.hide();
    } else {
        elem.show();
    }
}

function rollAbilities() {
    let values = [];
    for (var i = 0; i < 6; i++) {
        const roll = new Roll('4d6kh3').evaluate();
        values.push(roll.total);
    }

    toggleAbilitySelects(true, false);
    toggleAbilityInputs(false);
    togglePointBuyScore(false);
    toggleAbilityUpDownButtons(false, false);
    setAbilityInputs(values);
    updateAbilityModifiers();
}

function prepareStandardArray() {
    let values = [15, 14, 13, 12, 10, 8];
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
    document.getElementById('point-buy-current-score').innerHTML = '0';
    document.getElementById('point-buy-score').hidden = !isPointBuy;
}

function changeAbility(i: string, up: boolean) {
    let stat = $('#number' + i) as any;
    const value = parseInt(stat.val());
    const isPointBuy = $('#point-buy-score').is(':visible');
    const newValue = value + (up ? 1 : -1);

    stat.val(newValue + '');

    if (isPointBuy) {
        const cost = (up && value > 12) || (!up && value > 13) ? 2 : 1;
        const currentPointsElement = document.getElementById('point-buy-current-score');
        const currentPoints = parseInt(currentPointsElement.innerHTML);
        const maxPoints = parseInt(document.getElementById('point-buy-max-score').innerHTML);
        const newPoints = up ? currentPoints + cost : currentPoints - cost;
        currentPointsElement.innerHTML = newPoints + '';

        for (let j = 1; j < 7; j++) {
            const value = parseInt($('#number' + j).val() as string);
            const disableUp = (newPoints >= maxPoints) || (value == 15);
            const disableDown = (value == 8);
            $('#up' + j).prop('disabled', disableUp);
            $('#down' + j).prop('disabled', disableDown);
        }
        if (newPoints > maxPoints)
            alert(game.i18n.localize('HCT.Abitilies.PointBuyOverLimit'));
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

export function increaseAbility(i: string) {
    changeAbility(i, true);
}

export function decreaseAbility(i: string) {
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
        let n = i + 1;
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
        document.getElementById(id).innerHTML = (mod >= 0 ? '+' + mod : mod) + '';
    }
}

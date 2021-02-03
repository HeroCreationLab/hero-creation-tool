/*
  Functions used exclusively on the Abilities tab
*/
import HeroData from '../types/ActorData.js'
import { Utils } from '../utils.js'

export namespace AbilitiesTab {
    export function setListeners() {
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

    export function saveData(newActor: HeroData) {
        Utils.log('Saving Abilities Tab data into actor');

        let values: number[] = [];
        let stats: string[] = [];
        // Getting the stat
        values[0] = $('#number1').val() as number;
        values[1] = $('#number2').val() as number;
        values[2] = $('#number3').val() as number;
        values[3] = $('#number4').val() as number;
        values[4] = $('#number5').val() as number;
        values[5] = $('#number6').val() as number;

        // Getting the type of stat
        stats.push($('#stat1').val() as string);
        stats.push($('#stat2').val() as string);
        stats.push($('#stat3').val() as string);
        stats.push($('#stat4').val() as string);
        stats.push($('#stat5').val() as string);
        stats.push($('#stat6').val() as string);

        newActor.data = { abilities: {} } as any;
        for (var i = 0; i < stats.length; i++) {
            // Push abilities into the newActor object data
            const stat = stats[i].toLowerCase();
            (newActor.data.abilities as any)[`${stat}`] = { value: values[i] };
        }
    }
}

function updateAbilityScores() {
    const stat_block = [];
    for (let i = 1; i < 7; i++) {
        stat_block.push($(`#stat${i}`).val());
    }

    if (checkDuplicate(stat_block) == false) return true;
    else {
        alert(game.i18n.localize("HTC.Abitilies.NotAllSix"));
        return false;
    }
}

function checkDuplicate(listValues: Array<any>) {
    /**Check that there are no repeats */
    for (var x = 0; x < listValues.length; x++) {
        for (var y = 0; y < listValues.length; y++) {
            if (!listValues[x]) {
                return true;
            }
            if (listValues[x] == listValues[y] && x != y) {
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
            alert(game.i18n.localize('HTC.Abitilies.PointBuyOverLimit'));
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

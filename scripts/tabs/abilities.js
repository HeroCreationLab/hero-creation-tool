/*
  Functions used exclusively on the abilities tab
*/

function toggleAccordion() {
    var panel = document.getElementById("abilities-info")
    if (panel.style.display === "block") {
        panel.style.display = "none";
    } else {
        panel.style.display = "block";
    }
}

function rollAbilities() {
    let values = [];
    for (var i = 0; i < 6; i++) {
        const roll = new Roll("4d6kh3").evaluate();
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

function togglePointBuyScore(isPointBuy) {
    document.getElementById("point-buy-current-score").innerHTML = "0";
    document.getElementById("point-buy-score").hidden = !isPointBuy;
}

function changeAbility(i, up) {
    let stat = document.getElementById("number" + i);
    const value = stat.valueAsNumber;
    const isPointBuy = $('#point-buy-score').is(":visible");
    const newValue = value + (up ? 1 : -1);

    stat.value = newValue;

    if (isPointBuy) {
        const cost = (up && value > 12) || (!up && value > 13) ? 2 : 1;
        const currentPointsElement = document.getElementById("point-buy-current-score");
        const currentPoints = parseInt(currentPointsElement.innerHTML);
        const maxPoints = parseInt(document.getElementById("point-buy-max-score").innerHTML);
        const newPoints = up ? currentPoints + cost : currentPoints - cost;
        currentPointsElement.innerHTML = newPoints;

        for (let j = 1; j < 7; j++) {
            const v = document.getElementById("number" + j).valueAsNumber;
            const disableUp = (newPoints >= maxPoints) || (v == 15);
            const disableDown = (v == 8);
            $("#up" + j).prop("disabled", disableUp);
            $("#down" + j).prop("disabled", disableDown);
        }
        if (newPoints > maxPoints)
            alert(game.i18n.localize("HTC.Abitilies.PointBuyOverLimit"));
    } else {
        if (newValue == 20) {
            $("#up" + i).prop("disabled", true);
        } else if (newValue == 0) {
            $("#down" + i).prop("disabled", true);
        } else {
            $("#up" + i).prop("disabled", false);
            $("#down" + i).prop("disabled", false);
        }
    }
    updateAbilityModifiers();
}

function increaseAbility(i) {
    changeAbility(i, true);
}

function decreaseAbility(i) {
    changeAbility(i, false);
}

function setAbilityInputs(values) {
    for (let i = 0; i < 6; i++) {
        document.getElementById("number" + (i + 1)).value = Array.isArray(values) ? values[i] : values;
    }
}

function toggleAbilitySelects(enable, resetSelects) {
    for (let i = 0; i < 6; i++) {
        $("#stat" + (i + 1)).prop("disabled", !enable);
    }
    if (resetSelects) {
        for (let i = 0; i < 6; i++) {
            $("#stat" + (i + 1)).val("");
        }
    } else {
        $("#stat1").val("STR");
        $("#stat2").val("DEX");
        $("#stat3").val("CON");
        $("#stat4").val("INT");
        $("#stat5").val("WIS");
        $("#stat6").val("CHA");
    }
}

function toggleAbilityInputs(enable) {
    for (let i = 0; i < 6; i++) {
        $("#number" + (i + 1)).prop("disabled", !enable);
    }
}

function toggleAbilityUpDownButtons(show, enableDown) {
    for (let i = 0; i < 6; i++) {
        let n = i + 1;
        $("#up" + n).prop("disabled", false);
        $("#down" + n).prop("disabled", !enableDown);
        if (show) {
            $("#up" + n).show();
            $("#down" + n).show();
        } else {
            $("#up" + n).hide();
            $("#down" + n).hide();
        }
    }
}

function toggleAbilityScoresAndModifiersTable() {
    if ($("#ability-scores-modes-table").is(":visible"))
        $("#ability-scores-modes-table").hide();
    else
        $("#ability-scores-modes-table").show();
}

function updateAbilityModifiers() {
    for (let i = 0; i < 6; i++) {
        const mod = Math.floor((document.getElementById("number" + (i + 1)).valueAsNumber - 10) / 2);
        document.getElementById("mod" + (i + 1)).innerHTML = mod >= 0 ? "+" + mod : mod;
    }
}
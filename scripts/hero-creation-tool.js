/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
class HeroCreationTools extends Application {

    constructor(app, html) {
        super();
        this.app = app;
        this.html = html;
        this.newActor = {
            name: "New Actor",
            type: "character",
            img: "icons/svg/mystery-man.svg",
            folder: null,
            sort: 12000,
            data: {},
            token: {},
            items: [],
            flags: {}
        }
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = "modules/hero-creation-tool/templates/app.html";
        options.width = 700;
        options.height = 700;
        options.title = "Hero Creation";
        return options;
    }

    async openForActor(actorId) {
        this.actorId = actorId;
        this.render(true);
    }

    _checkDuplicate(listValues){
        /**Check that there are no repeats */
        for (var x = 0; x < listValues.length; x++) {
            for (var y = 0; y < listValues.length; y++) {
                if(!listValues[x]) {
                    return true;
                }
                if (listValues[x] == listValues[y] && x != y){
                    return true;
                }
            }
        }
        return false;
    }

    _updateAbilityScores(values, stat_block) {

        //Getting the stat
        values[0] = document.getElementById("number1").value;
        values[1] = document.getElementById("number2").value;
        values[2] = document.getElementById("number3").value;
        values[3] = document.getElementById("number4").value;
        values[4] = document.getElementById("number5").value;
        values[5] = document.getElementById("number6").value;

        //Getting the type of stat
        stat_block.push(document.getElementById("stat1").value);
        stat_block.push(document.getElementById("stat2").value);
        stat_block.push(document.getElementById("stat3").value);
        stat_block.push(document.getElementById("stat4").value);
        stat_block.push(document.getElementById("stat5").value);
        stat_block.push(document.getElementById("stat6").value);


        if (this._checkDuplicate(stat_block) == false){
            for (var i = 0; i < stat_block.length; i++) {
                // push abilities into the newActor object data
                this.newActor.data[`abilities.${stat_block[i].toLowerCase()}.value`] = parseInt(values[i]);
            }
            return true;
        }
        else {
            alert("You don't have all six abilities scores, check if you have some repeated or missing one.");
            return false;
        }

    }

    activateListeners(html) {
        
        html.find("#ability-mod-table-toggle").click(ev => toggleAbilityScoresAndModifiersTable());
        html.find("#abilityRandomize").click(ev => rollAbilities());
        html.find("#abilityStandard").click(ev => prepareStandardArray());
        html.find("#abilityPointBuy").click(ev => preparePointBuy());
        html.find("#abilityManual").click(ev => manualAbilities());
        html.find(".abilityUp").click(ev => {
            const stat = ev.currentTarget.id;
            const i = stat.charAt(stat.length-1);
            increaseAbility(i);
        });
        html.find(".abilityDown").click(ev => {
            const stat = ev.currentTarget.id;
            const i = stat.charAt(stat.length-1);
            decreaseAbility(i);
        });

        html.find("#basicsNext").click(ev => {
            saveBasicsOnActor(this.newActor);
            openTab(ev, 'raceDiv');
        });

        html.find(".raceSubmit").click(ev => {
            openTab(ev, 'classDiv');
        });
        html.find(".classSubmit").click(ev => {
            openTab(ev, 'abDiv');
        });
        html.find(".abilitySubmit").click(ev => {
            /**
             * TODO:
             * Change the on click event to a button in the review tab.
             * Get values from the current Application and send it to data.
             */
            let values = [];
            let stat_block = [];
            if (this._updateAbilityScores(values, stat_block)){
                this.app.render();
                openTab(ev, 'backgroundDiv');

            }
        });
        html.find(".backgroundSubmit").click(ev => {
            openTab(ev, 'eqDiv');
        });
        html.find(".equipmentSubmit").click(ev => {
            openTab(ev, 'spDiv');
        });
        html.find(".spellsSubmit").click(ev => {
            openTab(ev, 'featsDiv');
        });
        html.find(".featsSubmit").click(ev => {
            openTab(ev, 'bioDiv');
        });
        html.find(".bioSubmit").click(ev => {
            openTab(ev, 'reviewDiv');
        });

        html.find("#finalSubmit").click(ev => {
            buildActor(ev, this.newActor);
            this.close();
        });
    };
}

/* links to the css document */
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = '/text/css';
link.href = '/styles/hero-creation-tool.css';


Hooks.on('renderActorDirectory', (app,  html, data) => {
    configure_hero = new HeroCreationTools(app, html);

    let button = document.createElement('button');
    button.innerHTML = '<i class="fas fa-dice-d20"></i>Hero Creation Tool';
    button.addEventListener("click", function () {
        configure_hero.openForActor(null);
    });
    window.heroMancer = {};
    window.heroMancer.foundryCharacter = app;
    html.closest('.app').find('.configure_hero').remove();

    this.section = document.createElement('section')
    this.section.classList.add('hero-creation-tool');
    this.section.style.cssText = "margin: 3px; display: flex; align-items: center; justify-content: flex-start; max-height: fit-content;"
    this.section.appendChild(button);

    // Add menu before directory header
    const dirHeader = html[0].querySelector('.directory-header');
    dirHeader.parentNode.insertBefore(this.section, dirHeader);
});

/* This hooks onto the rendering actor sheet and makes a new object */
Hooks.on('renderActorSheet', (app, html, data) => {

    if (app.actor.data.type === 'npc') return;
    let actorId = data.actor._id;

    configure_hero = new HeroCreationTools(app, html);

    let button = $(`<a class="header-button configure_hero"}><i class="fas fa-dice-d20"></i>Hero Creation</a>`);
    button.click(ev =>{
        configure_hero.openForActor(actorId);
    });
    window.heroMancer = {};
    window.heroMancer.foundryCharacter = app;
    html.closest('.app').find('.configure_hero').remove();
    let titleElement = html.closest('.app').find('.configure-sheet');
    button.insertBefore(titleElement);
});

function rollAbilities() {
    let values = [];
    for (var i = 0; i < 6; i++) {
        const roll = new Roll("4d6kh3").evaluate();
        values.push(roll.total);
    }
    //values.sort((a, b) => b - a);

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
    let stat = document.getElementById("number"+i);
    const value = stat.valueAsNumber;
    const isPointBuy = $('#point-buy-score').is(":visible");
    const newValue = value + (up ? 1 : -1);

    stat.value = newValue;

    if(isPointBuy) {
        const cost = (up && value > 12) || (!up && value > 13) ? 2 : 1;
        const currentPointsElement = document.getElementById("point-buy-current-score");
        const currentPoints = parseInt(currentPointsElement.innerHTML);
        const maxPoints = parseInt(document.getElementById("point-buy-max-score").innerHTML);
        const newPoints = up ? currentPoints + cost : currentPoints - cost;
        currentPointsElement.innerHTML = newPoints;

        for(let j=1; j<7; j++) {
            const v = document.getElementById("number"+j).valueAsNumber;
            const disableUp = (newPoints >= maxPoints) || (v == 15);
            const disableDown = (v == 8);
            $("#up"+j).prop("disabled", disableUp);
            $("#down"+j).prop("disabled", disableDown);
        }
        // TODO do this on a notification? l18n?
        if(newPoints > maxPoints)
            alert("You have gone over the maximum points allowed for Point Buy");
    } else {
        if(newValue == 20) {
            $("#up"+i).prop("disabled", true);
        } else if(newValue == 0) {
            $("#down"+i).prop("disabled", true);
        } else {
            $("#up"+i).prop("disabled", false);
            $("#down"+i).prop("disabled", false);
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
    for(let i=0; i<6; i++) {
        document.getElementById("number"+(i+1)).value = Array.isArray(values) ? values[i] : values;
    }
}

function toggleAbilitySelects(enable, resetSelects) {
    for(let i=0; i<6; i++) {
        $("#stat"+(i+1)).prop("disabled", !enable);
    }
    if(resetSelects) {
        for(let i=0; i<6; i++) {
            $("#stat"+(i+1)).val("");
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
    for(let i=0; i<6; i++) {
        $("#number"+(i+1)).prop("disabled", !enable);
    }
}

function toggleAbilityUpDownButtons(show, enableDown) {
    for(let i=0; i<6; i++) {
        let n = i+1;
        $("#up"+n).prop( "disabled", false );
        $("#down"+n).prop( "disabled", !enableDown );
        if(show){
            $("#up"+n).show();
            $("#down"+n).show();
        } else {
            $("#up"+n).hide();
            $("#down"+n).hide();
        }
    }
}

function toggleAbilityScoresAndModifiersTable() {
    if($("#ability-scores-modes-table").is(":visible"))
        $("#ability-scores-modes-table").hide();
    else
        $("#ability-scores-modes-table").show();
}

function updateAbilityModifiers() {
    for(let i=0; i<6; i++) {
        const mod = Math.floor( (document.getElementById("number"+(i+1)).valueAsNumber - 10) / 2);
        document.getElementById("mod"+(i+1)).innerHTML = mod >= 0 ? "+"+mod : mod;
    }
}

async function buildActor(event, newActor) {
    debugger;
    // Check actor has a name
    /*
    if( actor has no name ) {
        // TODO: add warning on review & disable button (on review load, not here, here is too late)
        alert("Hero needs a name, please ")
    }
    */
 
    // Creating new actor based on collected data
    actor = await Actor.create(newActor);
}

function openFilePicker(input) {
    console.log("on openFilePicker...");
    let path1 = "/"
    let fp2 = new FilePicker({
       type: "image",
       current: path1,
       callback: path => {
           document.getElementById(`${input}_path`).value = path;
           document.getElementById(`${input}_img`).src = path;
       },
    })
    fp2.browse();
 }

 function saveBasicsOnActor(actor) {
    actor.name = document.getElementById("actor_name").value;
    actor.img = document.getElementById("avatar_path").value;
    //actor.token = {}
 }
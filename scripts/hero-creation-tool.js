/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
const modulePath = "modules/hero-creation-tool";
class HeroCreationTools extends Application {

    constructor(app, html) {
        super();
        this.app = app;
        this.html = html;
        this.newActor = {
            name: null,
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
        options.template = modulePath + "/templates/app.html";
        options.width = 700;
        options.height = 700;
        options.title = "Hero Creation";
        return options;
    }

    async openForActor(actorId) {
        this.actorId = actorId;
        this.render(true);
    }

    _checkDuplicate(listValues) {
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

    _updateAbilityScores() {
        const stat_block = [];
        stat_block.push(document.getElementById("stat1").value);
        stat_block.push(document.getElementById("stat2").value);
        stat_block.push(document.getElementById("stat3").value);
        stat_block.push(document.getElementById("stat4").value);
        stat_block.push(document.getElementById("stat5").value);
        stat_block.push(document.getElementById("stat6").value);


        if (this._checkDuplicate(stat_block) == false) {
            return true;
        }
        else {
            alert(game.i18n.localize("HTC.Abitilies.NotAllSix"));
            return false;
        }
    }

    activateListeners(html) {
        html.find(".abilityUp").click(ev => {
            const stat = ev.currentTarget.id;
            const i = stat.charAt(stat.length - 1);
            increaseAbility(i);
        });
        html.find(".abilityDown").click(ev => {
            const stat = ev.currentTarget.id;
            const i = stat.charAt(stat.length - 1);
            decreaseAbility(i);
        });

        html.find("#basicsNext").click(ev => {
            openTab(ev, 'raceDiv');
        });

        html.find(".raceSubmit").click(ev => {
            openTab(ev, 'classDiv');
        });
        html.find(".classSubmit").click(ev => {
            openTab(ev, 'abDiv');
        });
        html.find(".abilitySubmit").click(ev => {
            if (this._updateAbilityScores()) {
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

Hooks.once("init", () => {
    // Preload Handlebars Templates
    const templatePaths = [
        // Partials
        modulePath + "/templates/tabs/abilities.html",
        modulePath + "/templates/tabs/background.html",
        modulePath + "/templates/tabs/basics.html",
        modulePath + "/templates/tabs/bio.html",
        modulePath + "/templates/tabs/class.html",
        modulePath + "/templates/tabs/equipment.html",
        modulePath + "/templates/tabs/race.html",
        modulePath + "/templates/tabs/review.html",
        modulePath + "/templates/tabs/spells.html",
        modulePath + "/templates/tabs/start.html",
    ];
    // Load the template parts
    loadTemplates(templatePaths);

    // Define Module Settings options
    buildModuleSettings();
});

/* This hooks onto the rendering of the Actor Directory to show the button */
Hooks.on('renderActorDirectory', (app, html) => {
    configure_hero = new HeroCreationTools(app, html);

    let button = document.createElement('button');
    const title = game.i18n.localize("HTC.Title");
    button.innerHTML = `<i class='fas fa-dice-d20'></i>${title}`;
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

    let button = $(`<a class="header-button configure_hero"}><i class="fas fa-dice-d20"></i>{{localize 'HTC.ActorSheetCreateButton'}}</a>`);
    button.click(ev => {
        configure_hero.openForActor(actorId);
    });
    window.heroMancer = {};
    window.heroMancer.foundryCharacter = app;
    html.closest('.app').find('.configure_hero').remove();
    let titleElement = html.closest('.app').find('.configure-sheet');
    button.insertBefore(titleElement);
});

function buildModuleSettings() {
    game.settings.register("hero-creation-tool", "displayNameMode", {
        name: game.i18n.localize("HTC.Setting.TokenNameMode"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": "Never Displayed",
            "10": "When Controlled",
            "20": "Hover by Owner",
            "30": "Hover by Anyone",
            "40": "Always for Owner",
            "50": "Always for Anyone"
        },
        default: "20",
        onChange: value => console.log(value)
    });

    game.settings.register("hero-creation-tool", "displayBarsMode", {
        name: game.i18n.localize("HTC.Setting.TokenBarMode"),
        hint: game.i18n.localize("HTC.Setting.TokenBarMode.hint"),
        scope: "world",
        config: true,
        type: String,
        choices: {
            "0": "Never Displayed",
            "10": "When Controlled",
            "20": "Hover by Owner",
            "30": "Hover by Anyone",
            "40": "Always for Owner",
            "50": "Always for Anyone"
        },
        default: "20",
        onChange: value => console.log(value)
    });
}

/* Copies all the data in the tabs into the newActor, then creates the actor */
async function buildActor(event, newActor) {
    recordBasics(newActor);
    recordRace(newActor); // TODO - function empty
    recordClass(newActor); // TODO - function empty
    recordAbilities(newActor);
    recordBackground(newActor); // TODO - function empty
    recordEquipment(newActor); // TODO - function empty
    recordBio(newActor);

    // Creating new actor based on collected data
    Actor.create(newActor);
}

function recordBasics(actor) {
    actor.name = document.getElementById("actor_name").value;
    actor.img = document.getElementById("avatar_path").value;

    const dimSight = 60; // FIXME - this should depend on the race/class
    actor.token = {
        actorLink: true,
        disposition: 1,
        img: document.getElementById("token_path").value,
        vision: true,
        dimSight: dimSight,
        bar1: { attribute: "attributes.hp" },
        displayBars: game.settings.get("hero-creation-tool", "displayBarsMode"),
        displayName: game.settings.get("hero-creation-tool", "displayNameMode"),
    }
}

function recordRace(actor) { }

function recordClass(actor) { }

function recordAbilities(actor) {
    let values = [], stats = [];
    // Getting the stat
    values[0] = document.getElementById("number1").value;
    values[1] = document.getElementById("number2").value;
    values[2] = document.getElementById("number3").value;
    values[3] = document.getElementById("number4").value;
    values[4] = document.getElementById("number5").value;
    values[5] = document.getElementById("number6").value;

    // Getting the type of stat
    stats.push(document.getElementById("stat1").value);
    stats.push(document.getElementById("stat2").value);
    stats.push(document.getElementById("stat3").value);
    stats.push(document.getElementById("stat4").value);
    stats.push(document.getElementById("stat5").value);
    stats.push(document.getElementById("stat6").value);

    for (var i = 0; i < stats.length; i++) {
        // Push abilities into the newActor object data
        actor.data[`abilities.${stats[i].toLowerCase()}.value`] = parseInt(values[i]);
    }
}

function recordBackground(actor) { }

function recordEquipment(actor) { }

function recordBio(actor) {
    let appearance = "";
    appearance = appearance.concat(`Age: ${document.getElementById("character_age").value}`)
    appearance = appearance.concat(`\nHeight: ${document.getElementById("character_height").value}`)
    appearance = appearance.concat(`\nWeight: ${document.getElementById("character_weight").value}`)
    appearance = appearance.concat(`\nEyes: ${document.getElementById("character_eye_color").value} ${document.getElementById("character_eye_rgb").value}`)
    appearance = appearance.concat(`\nHair: ${document.getElementById("character_hair_color").value} ${document.getElementById("character_hair_rgb").value}`)
    appearance = appearance.concat(`\nSkin: ${document.getElementById("character_skin_color").value} ${document.getElementById("character_skin_rgb").value}`)

    actor.data.details = {
        appearance: appearance,
        biography: { value: document.getElementById("character_biography").value },
    }
}
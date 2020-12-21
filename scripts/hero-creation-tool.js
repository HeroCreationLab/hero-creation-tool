/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
class HeroCreationTools extends Application {

    constructor(app, html) {
        super();
        this.app = app;
        this.html = html;
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

    _updateAbilityScores(values, stat_block) {
        /**
         * Take out this random pre-fill when done
         */

        values[0] = document.getElementById("number1").value;
        values[1] = document.getElementById("number2").value;
        values[2] = document.getElementById("number3").value;
        values[3] = document.getElementById("number4").value;
        values[4] = document.getElementById("number5").value;
        values[5] = document.getElementById("number6").value;


        stat_block.push(document.getElementById("stat1").value)
        stat_block.push(document.getElementById("stat2").value)
        stat_block.push(document.getElementById("stat3").value)
        stat_block.push(document.getElementById("stat4").value)
        stat_block.push(document.getElementById("stat5").value)
        stat_block.push(document.getElementById("stat6").value)

        console.log(stat_block);
        console

        for (var i = 0; i < stat_block.length; i++) {
            if (stat_block[i] == "STR") {
                this.app.object.data.data.abilities.str.value = values[i];
            }
            else if (stat_block[i] == "DEX") {
                this.app.object.data.data.abilities.dex.value = values[i];
            }
            else if (stat_block[i] == "CON") {
                this.app.object.data.data.abilities.con.value = values[i];
            }
            else if (stat_block[i] == "INT") {
                this.app.object.data.data.abilities.int.value = values[i];
            }
            else if (stat_block[i] == "WIS") {
                this.app.object.data.data.abilities.wis.value = values[i];
            }
            else if (stat_block[i] == "CHAR") {
                this.app.object.data.data.abilities.cha.value = values[i];
            }
        }

    }

    activateListeners(html) {

        html.find(".abilityRandomize").click(ev => {
            let values = [];
            let stat_block = [];

            for (var i = 0; i < 6; i++) {
                values.push(roll4d6b3());
            }
            document.getElementById("number1").value = values[0];
            document.getElementById("number2").value = values[1];
            document.getElementById("number3").value = values[2];
            document.getElementById("number4").value = values[3];
            document.getElementById("number5").value = values[4];
            document.getElementById("number6").value = values[5];
            this._updateAbilityScores(values, stat_block);
        });
        html.find(".abilitySubmit").click(ev => {
            /**
             * TODO:
             * Change the on click event to a button in the review tab.
             * Get values from the current Application and send it to data.
             */
            let values = [];
            let stat_block = [];
            this._updateAbilityScores(values, stat_block);
            this.app.render();
        });
    }
}

/* links to the css document */
var link = document.createElement('link');
link.rel = 'stylesheet';
link.type = '/text/css';
link.href = '/styles/hero-creation-tool.css';

/* This hooks onto the rendering actor sheet and makes a new object */
Hooks.on('renderActorSheet', (app, html, data) => {

    if (app.actor.data.type === 'npc') return;
    let actorId = data.actor._id;

    configure_hero = new HeroCreationTools(app, html);

    let button = $(`<a class="header-button configure_hero"}>Hero Creation</a>`);
    button.click(ev => {
        console.log("button pressed!");
        configure_hero.openForActor(actorId);
        console.log(configure_hero);
    });
    html.closest('.app').find('.configure_hero').remove();
    let titleElement = html.closest('.app').find('.configure-sheet');
    button.insertBefore(titleElement);

});
function roll4d6b3() {
    const statroll1 = Math.floor(Math.random() * 6) + 1;
    const statroll2 = Math.floor(Math.random() * 6) + 1;
    const statroll3 = Math.floor(Math.random() * 6) + 1;
    const statroll4 = Math.floor(Math.random() * 6) + 1;
    const statArray = [];

    statArray.push(statroll1);
    statArray.push(statroll2);
    statArray.push(statroll3);
    statArray.push(statroll4);

    var newStatArray = removeSmallest(statArray);
    var sumStat = 0;
    for (var i = 0; i < newStatArray.length; i++) {
        sumStat += newStatArray[i]
    }
    return sumStat;
}
function removeSmallest(numbers) {
    const smallest = Math.min.apply(null, numbers);
    const pos = numbers.indexOf(smallest);
    return numbers.slice(0, pos).concat(numbers.slice(pos + 1));
};
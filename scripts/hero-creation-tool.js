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

    async openForActor(actorId){
        this.actorId = actorId;
        this.render(true);
    }

    _updateAbilityScores(values) {
        /**
         * Take out this random pre-fill when done
         */
        for (var i = 0; i < 6; i++) {
            values.push(roll4d6b3());
        }
        
        this.app.object.data.data.abilities.str.value = values[0];
        this.app.object.data.data.abilities.dex.value = values[1];
        this.app.object.data.data.abilities.con.value = values[2];
        this.app.object.data.data.abilities.int.value = values[3];
        this.app.object.data.data.abilities.wis.value = values[4];
        this.app.object.data.data.abilities.cha.value = values[5];
    
    }

    activateListeners(html){
        html.find(".abilitySubmit").click(ev => {
            /**
             * TODO:
             * Change the on click event to a button in the review tab.
             * Get values from the current Application and send it to data.
             */
            let values = [];
            this._updateAbilityScores(values);
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
    button.click(ev =>{
        console.log("button pressed!");
        configure_hero.openForActor(actorId);
        
        
        console.log(configure_hero);
    });
    html.closest('.app').find('.configure_hero').remove();
    let titleElement = html.closest('.app').find('.configure-sheet');
    button.insertBefore(titleElement);

});
function roll4d6b3()
{
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
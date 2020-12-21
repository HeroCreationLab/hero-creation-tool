/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
class HeroCreationTools extends Application {
    
    constructor() {
        super();
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

    configure_hero = new HeroCreationTools();
    
    let button = $(`<a class="header-button configure_hero"}>Hero Creation</a>`);
    button.click(ev =>{
        configure_hero.openForActor(actorId);
    });
    window.heroMancer.foundryCharacter = app;
    let titleElement = html.closest('.app').find('.configure-sheet');
    button.insertBefore(titleElement);
});

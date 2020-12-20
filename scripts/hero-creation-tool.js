class heroCreationTools extends Application {

 constructor() {
        super();
        this._initialize();
    }
}
var link = document.createElement('link');  
link.rel = 'stylesheet';  
link.type = 'text/css'; 
link.href = '../styles/hero-creation.css';  

Hooks.on('renderActorSheet', (app, html, data) => { 
   
    if (app.actor.data.type === 'npc') return;
    if (heroCreationTools === undefined) {
        heroCreationTools = new heroCreationTools();
    }
    //let actorId = data.actor._id;
    let button = $(`<button class="first"}>Hi</button>`);
    button.click(ev =>{
        console.log("button pressed!");
    });
    let titleElement = html.closest('.app').find('.window-title');
    button.insertAfter(titleElement);

});

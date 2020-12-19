class heroCreationTools extends Application {

 constructor() {
        super();
        this._initialize();
    }

   

}

Hooks.on('renderActorSheet', (app, html, data) => { 
    if (app.actor.data.type === 'npc') return;
    if (heroCreationTools === undefined) {
        heroCreationTools = new heroCreationTools();
    }
    //   let actorId = data.actor._id;
    let button = $(`<button>Hi </button>` + data.actor._id);
    html.closest('.app').find('.open-stat-drawer').remove();
    let titleElement = html.closest('.app').find('.window-title');
    button.insertAfter(titleElement);
});
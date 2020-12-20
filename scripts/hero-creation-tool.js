class HeroCreationTools extends FormApplication {
    
}

var link = document.createElement('link');  
link.rel = 'stylesheet';  
link.type = 'text/css'; 
link.href = '../styles/hero-creation-tool.css';  

Hooks.on('renderActorSheet', (app, html, data) => { 
   
    if (app.actor.data.type === 'npc') return;
    let actorId = data.actor._id;

    let button = $(`<a class="header-button configure_hero"}>Hero Creation</a>`);
    configure_hero = new HeroCreationTools(actorId, ["",""]);

    button.click(ev =>{
        console.log("button pressed!");
    });
    let titleElement = html.closest('.app').find('.configure-sheet');
    button.insertBefore(titleElement);

});

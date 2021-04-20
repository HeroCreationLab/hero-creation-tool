import HeroCreationTool from './HeroCreationTool.js'
import { Constants } from './constants.js'
import { ModuleSettings } from './moduleSettings.js'
import { DataPrep } from './dataPrep.js'

/*
	This file defines the Foundry Hooks, loads Handlebars templates and makes other general initialization
	related to presentation, files and etc
*/
const moduleApp = new HeroCreationTool();

//This hook runs once the Foundry VTT software begins it's initialization workflow
Hooks.once("init", () => {
	// Templates array
	const templatePaths = [
		Constants.MODULE_PATH + "/templates/tabs/abilities.html",
		Constants.MODULE_PATH + "/templates/tabs/background.html",
		Constants.MODULE_PATH + "/templates/tabs/basics.html",
		Constants.MODULE_PATH + "/templates/tabs/bio.html",
		Constants.MODULE_PATH + "/templates/tabs/class.html",
		Constants.MODULE_PATH + "/templates/tabs/equipment.html",
		Constants.MODULE_PATH + "/templates/tabs/race.html",
		Constants.MODULE_PATH + "/templates/tabs/review.html",
		Constants.MODULE_PATH + "/templates/tabs/spells.html",
		Constants.MODULE_PATH + "/templates/tabs/start.html",
	];
	// Load the templates
	console.log(`${Constants.LOG_PREFIX} | Loading templates`);
	loadTemplates(templatePaths);

	// Define Module Settings options
	ModuleSettings.buildOptions();
});


//This hook runs once core initialization is ready and game data is available
Hooks.on("ready", async function () {
	console.log(`${Constants.LOG_PREFIX} | Starting initialization`);
	moduleApp.setupData();
});


Hooks.on("renderHeroCreationTool", async function () {
	console.log(`${Constants.LOG_PREFIX} | Rendering tool - setting up data-derived elements`);
	moduleApp.renderChildrenData();
});


// This hooks onto the rendering of the Actor Directory to show the button
Hooks.on("renderActorDirectory", () => {
	console.log(`${Constants.LOG_PREFIX} | Adding actors directory button`);
	$('.directory-header').first().prepend(`<button class='header-hct-button' data-hct_start><i class='fas fa-dice-d20'></i>${game.i18n.localize("HCT.Title")}</button>`);
	$('[data-hct_start]').on('click', function () {
		moduleApp.openForActor(null);
	});
});


// This hooks onto the rendering actor sheet to show the button
/*
	Commented until we start working on a level up feature
*/
// Hooks.on('renderActorSheet', (app, html, data) => {
// 	if (app.actor.data.type === 'npc') return;
// 	const moduleApp = new HeroCreationTool(app, html);
// 	const button = $(`<a id='actor-sheet-btn'><i class="fas fa-dice-d20"></i>${game.i18n.localize("HCT.ActorSheetCreateButton")}</a>`);
// 	button.insertBefore(html.closest('.app').find('.configure-sheet'));
// 	$('#actor-sheet-btn').on('click', function () {
// 		moduleApp.openForActor(data.actor._id);
// 	});
// });

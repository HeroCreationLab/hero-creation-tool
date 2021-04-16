import HeroCreationTool from './hero-creation-tool.js'
import { Constants } from './constants.js';
import { ModuleSettings } from './module-settings.js';

/*
	This file defines the Foundry Hooks, loads Handlebars templates and makes other general initialization
	related to presentation, files and etc
*/
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

/* This hooks onto the rendering of the Actor Directory to show the button */
Hooks.once("renderActorDirectory", (app, html) => {
	console.log(`${Constants.LOG_PREFIX} | Adding actors directory button`);
	const moduleApp = new HeroCreationTool(app, html);
	$('.directory-header').prepend(`<div class='header-hct flexrow'><button id='actors-directory-btn'><i class='fas fa-dice-d20'></i>${game.i18n.localize("HTC.Title")}</button></div>`);
	$('#actors-directory-btn').on('click', function () {
		moduleApp.openForActor(null);
	});
});

/* This hooks onto the rendering actor sheet to show the button */
Hooks.on('renderActorSheet', (app, html, data) => {
	if (app.actor.data.type === 'npc') return;
	const moduleApp = new HeroCreationTool(app, html);
	const button = $(`<a id='actor-sheet-btn'><i class="fas fa-dice-d20"></i>${game.i18n.localize("HTC.ActorSheetCreateButton")}</a>`);
	button.insertBefore(html.closest('.app').find('.configure-sheet'));
	$('#actor-sheet-btn').on('click', function () {
		moduleApp.openForActor(data.actor._id);
	});
});

import HeroCreationTools from './hero-creation-tool.js'
import { AppConstants } from './constants.js';

/*
	This file defines the Foundry Hooks, loads Handlebars templates and makes other general initialization
	related to presentation, files and etc
*/

Hooks.once("init", () => {
	// Preload Handlebars Templates
	const templatePaths = [
		// Partials
		AppConstants.MODULE_PATH + "/templates/tabs/abilities.html",
		AppConstants.MODULE_PATH + "/templates/tabs/background.html",
		AppConstants.MODULE_PATH + "/templates/tabs/basics.html",
		AppConstants.MODULE_PATH + "/templates/tabs/bio.html",
		AppConstants.MODULE_PATH + "/templates/tabs/class.html",
		AppConstants.MODULE_PATH + "/templates/tabs/equipment.html",
		AppConstants.MODULE_PATH + "/templates/tabs/race.html",
		AppConstants.MODULE_PATH + "/templates/tabs/review.html",
		AppConstants.MODULE_PATH + "/templates/tabs/spells.html",
		AppConstants.MODULE_PATH + "/templates/tabs/start.html",
	];
	// Load the template parts
	loadTemplates(templatePaths);

	// Define Module Settings options
	buildModuleSettings();
});

/* This hooks onto the rendering of the Actor Directory to show the button */
Hooks.on('renderActorDirectory', (app, html) => {
	const configureHero = new HeroCreationTools(app, html);

	let button = document.createElement('button');
	const title = game.i18n.localize("HTC.Title");
	button.innerHTML = `<i class='fas fa-dice-d20'></i>${title}`;
	button.addEventListener("click", function () {
		configureHero.openForActor(null);
	});
	const win = (window) as Record<string, any>
	win.heroMancer = {};
	win.heroMancer.foundryCharacter = app;
	html.closest('.app').find('.configure_hero').remove();

	const section = document.createElement('section')
	section.classList.add('hero-creation-tool');
	section.style.cssText = "margin: 3px; display: flex; align-items: center; justify-content: flex-start; max-height: fit-content;"
	section.appendChild(button);

	// Add menu before directory header
	const dirHeader = html[0].querySelector('.directory-header');
	dirHeader.parentNode.insertBefore(section, dirHeader);
});

/* This hooks onto the rendering actor sheet and makes a new object */
Hooks.on('renderActorSheet', (app, html, data) => {

	if (app.actor.data.type === 'npc') return;
	let actorId = data.actor._id;

	const configureHero = new HeroCreationTools(app, html);

	const title = game.i18n.localize("HTC.ActorSheetCreateButton");
	let button = $(`<a class="header-button configure_hero"}><i class="fas fa-dice-d20"></i>${title}</a>`);
	button.click(ev => {
		configureHero.openForActor(actorId);
	});
	const win = (window) as any;
	win.heroMancer = {};
	win.heroMancer.foundryCharacter = app;
	html.closest('.app').find('.configure_hero').remove();
	let titleElement = html.closest('.app').find('.configure-sheet');
	button.insertBefore(titleElement);
});

function buildModuleSettings() {
	game.settings.register("hero-creation-tool", "displayNameMode", {
		name: game.i18n.localize("HTC.Setting.TokenNameMode"),
		scope: "world",
		config: true,
		choices: {
			"0": "Never Displayed",
			"10": "When Controlled",
			"20": "Hover by Owner",
			"30": "Hover by Anyone",
			"40": "Always for Owner",
			"50": "Always for Anyone"
		},
		default: "20",
	});

	game.settings.register("hero-creation-tool", "displayBarsMode", {
		name: game.i18n.localize("HTC.Setting.TokenBarMode"),
		scope: "world",
		config: true,
		choices: {
			"0": "Never Displayed",
			"10": "When Controlled",
			"20": "Hover by Owner",
			"30": "Hover by Anyone",
			"40": "Always for Owner",
			"50": "Always for Anyone"
		},
		default: "20",
	});
}

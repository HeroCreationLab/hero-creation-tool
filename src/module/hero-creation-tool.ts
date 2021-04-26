import { registerSettings } from './settings';
import { preloadTemplates } from './preloadTemplates';
import * as Constants from './constants';
import App from './app';

const moduleApp = new App();

// Initialize module
Hooks.once('init', async () => {
  console.log(`${Constants.LOG_PREFIX} | Initializing hero-creation-tool`);
  registerSettings();
  await preloadTemplates();
});

// Setup module
Hooks.once('setup', async () => {
  // Do anything after initialization but before ready
});

// When ready
Hooks.once('ready', async () => {
  // Do anything once the module is ready
  console.log(`${Constants.LOG_PREFIX} | Starting initialization`);
  moduleApp.setupData();
});

Hooks.on('renderHeroCreationTool', async function () {
  console.log(`${Constants.LOG_PREFIX} | Rendering tool - setting up data-derived elements`);
  moduleApp.renderChildrenData();
});

// This hooks onto the rendering of the Actor Directory to show the button
Hooks.on('renderActorDirectory', () => {
  console.log(`${Constants.LOG_PREFIX} | Adding actors directory button`);
  $('.directory-header')
    .first()
    .prepend(
      `<button class='header-hct-button' data-hct_start><i class='fas fa-dice-d20'></i>${game.i18n.localize(
        'HCT.Title',
      )}</button>`,
    );
  $('[data-hct_start]').on('click', function () {
    moduleApp.openForActor();
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

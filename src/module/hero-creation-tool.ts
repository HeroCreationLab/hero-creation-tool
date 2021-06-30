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

Hooks.on('renderApp', async function (app: any, html: any, data: any) {
  if (app.options.title == 'Hero Creation') {
    // if (app._priorState == 0) {
    //   // first start, if we need to calculate something ?
    // }
    console.log(`${Constants.LOG_PREFIX} | Setting up data-derived elements`);
    await moduleApp.setupData();
    moduleApp.renderChildrenData();
  }
});

// This hooks onto the rendering of the Actor Directory to show the button
Hooks.on('renderActorDirectory', () => {
  console.log(`${Constants.LOG_PREFIX} | Adding actors directory button`);
  $('.directory-header', $('[data-tab="actors"]'))
    .first()
    .prepend(
      `<button class='header-hct-button' data-hct_start><i class='fas fa-dice-d20'></i>${game.i18n.localize(
        'HCT.ActorsDirectoryButton',
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

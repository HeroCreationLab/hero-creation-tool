import { registerSettings } from './settings';
import { preloadTemplates } from './preloadTemplates';
import * as Constants from './constants';
import HeroCreationTool from './HeroCreationToolApp';

const heroCreationTool = new HeroCreationTool();

// Initialize module
Hooks.once('init', async () => {
  console.log(`${Constants.LOG_PREFIX} | Initializing hero-creation-tool`);
  registerSettings();
  await preloadTemplates();
});

Hooks.on('renderHeroCreationTool', async function (app: any, html: any, data: any) {
  console.log(`${Constants.LOG_PREFIX} | Setting up data-derived elements`);
  await heroCreationTool.setupData();
  heroCreationTool.renderChildrenData();
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
    if (userHasRightPermissions()) heroCreationTool.openForActor();
  });
});

function userHasRightPermissions(): boolean {
  const userRole = (game as any).user.role;

  // create actor (REQUIRED)
  if (!((game as any).permissions.ACTOR_CREATE as Array<number>).includes(userRole)) {
    ui.notifications?.error(game.i18n.localize('HCT.Permissions.NeedCreateActorError'));
    return false;
  }

  // create item (optional)
  if (!((game as any).permissions.ITEM_CREATE as Array<number>).includes(userRole)) {
    ui.notifications?.warn(game.i18n.localize('HCT.Permissions.NeedCreateItemWarn'));
  }

  // upload files (optional)
  if (!((game as any).permissions.FILES_UPLOAD as Array<number>).includes(userRole)) {
    ui.notifications?.warn(game.i18n.localize('HCT.Permissions.NeedFileUploadWarn'));
  }

  // browse files (optional)
  if (!((game as any).permissions.FILES_BROWSE as Array<number>).includes(userRole)) {
    ui.notifications?.warn(game.i18n.localize('HCT.Permissions.NeedFileBrowseWarn'));
  }
  return true;
}

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

import * as Constants from './constants';
import HeroCreationTool from './HeroCreationToolApp';
import SettingKeys from './settings';

export function setPanelScrolls($section: JQuery) {
  const individualScrolls = getModuleSetting(SettingKeys.INDIVIDUAL_PANEL_SCROLLS);
  const scroll = 'hct-y-scroll';
  const height = 'hct-height-100p';

  const $leftPanel = $('.hct-panel-left', $section);
  const $rightPanel = $('.hct-panel-right', $section);
  const $panelContainer = $('.hct-panel-container', $section);

  if (individualScrolls) {
    $leftPanel.addClass(scroll);
    $rightPanel.addClass(scroll);
    $panelContainer.addClass(height);
    $section.removeClass(scroll);
  } else {
    $leftPanel.removeClass(scroll);
    $rightPanel.removeClass(scroll);
    $panelContainer.removeClass(height);
    $section.addClass(scroll);
  }
}

export function getModuleSetting(key: SettingKeys) {
  return game.settings.get(Constants.MODULE_NAME, key);
}

export function getAbilityModifierValue(value: number) {
  return Math.floor((value - 10) / 2);
}

export function filterItemList<T>({
  filterValues,
  filterField,
  itemList,
}: {
  filterValues: string[];
  filterField: string;
  itemList: T[];
}): T[] {
  if (!itemList) return [];
  const filtered = itemList.filter((item: any) => {
    const req: string = getProperty(item, filterField);
    let reqs: string[];
    if (req.indexOf(',') > -1) {
      // feature applies for multiple classes / races / levels
      reqs = req.split(',').map((r) => r.trim());
    } else {
      reqs = [req];
    }
    return reqs.some((r) => filterValues.includes(r) && !filterValues.includes(item.name));
  });
  return filtered;
}

export function addActorDirectoryButton(app: HeroCreationTool) {
  console.log(`${Constants.LOG_PREFIX} | Adding actors directory button`);

  $('.directory-header', $('[data-tab="actors"]'))
    .first()
    .prepend(
      `<button class='header-hct-button' data-hct_start><i class='fas fa-dice-d20'></i>${game.i18n.localize(
        'HCT.ActorsDirectoryButton',
      )}</button>`,
    );
  $('[data-hct_start]').on('click', function () {
    if (userHasRightPermissions()) app.openForNewActor();
  });
}

export function addCreateNewActorButton(app: HeroCreationTool, html: any, dialogApp: any) {
  console.log(`${Constants.LOG_PREFIX} | Adding Create New Actor button`);

  const $hctButton = $(
    `<button class='dialog-button' data-hct_start>
      <i class='fas fa-dice-d20'></i>${game.i18n.localize('HCT.ActorsDirectoryButton')}
    </button>`,
  );

  $('button', html).after($hctButton); // added after the Create New Actor confirm button
  $hctButton.on('click', function () {
    if (userHasRightPermissions()) {
      const heroName = $('input', html).val() as string;
      app.openForNewActor(heroName);
    }
    dialogApp.close();
  });
}

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

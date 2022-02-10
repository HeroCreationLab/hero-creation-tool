import CompendiumSourcesSubmenu from './compendiumSourcesSubmenu';
import { MODULE_ID, LOG_PREFIX } from './constants';
import HeroCreationTool from './heroCreationToolApp';
import SettingKeys, { PrivateSettingKeys } from './settings';

export function setPanelScrolls($section: JQuery) {
  const individualScrolls = getModuleSetting(SettingKeys.INDIVIDUAL_PANEL_SCROLLS);
  const scroll = 'hct-overflow-y-scroll';
  const height = 'hct-h-full';

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

export async function setModuleSetting(key: SettingKeys | PrivateSettingKeys, value: any) {
  await game.settings.set(MODULE_ID, key, value);
}

export function getModuleSetting(key: SettingKeys | PrivateSettingKeys) {
  return game.settings.get(MODULE_ID, key);
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
  console.log(`${LOG_PREFIX} | Adding actors directory button`);

  $('.directory-header .header-actions', $('[data-tab="actors"]'))
    .filter((i, e) => !$(e).has('#hct-directory-button').length)
    .append(
      `<button id='hct-directory-button' data-hct_start><i class='fas fa-dice-d20'></i>${game.i18n.localize(
        'HCT.ActorsDirectoryButton',
      )}</button>`,
    );
  $('[data-hct_start]').on('click', function () {
    if (userHasRightPermissions()) app.openForNewActor();
  });
}

export function addCreateNewActorButton(app: HeroCreationTool, html: any, dialogApp: any) {
  console.log(`${LOG_PREFIX} | Adding Create New Actor button`);

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

export function setPublicApi(app: HeroCreationTool) {
  (window as any).HeroCreationTool = {
    selectSources: () => {
      console.warn();
      const sourcesApp = new CompendiumSourcesSubmenu();
      sourcesApp.render(true);
    },
    openForNewActor: () => app.openForNewActor(),
  };

  (game.modules.get(MODULE_ID) as any).api = {
    selectSources: () => {
      const sourcesApp = new CompendiumSourcesSubmenu();
      sourcesApp.render(true);
    },
    openForNewActor: () => app.openForNewActor(),
  };
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

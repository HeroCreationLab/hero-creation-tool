import CompendiumSourcesSubmenu from './compendiumSourcesSubmenu';
import { MODULE_ID, LOG_PREFIX, DEFAULT_SOURCES, DEFAULT_PACKS } from './constants';
import HeroCreationTool from './heroCreationToolApp';
import SettingKeys, { PrivateSettingKeys } from './settings';

interface DnD5eGame extends Game {
  dnd5e: {
    advancement: {
      types: {
        [key: string]: any;
      };
    };
    config: {
      currencies: {
        [id: string]: { conversion: number };
      };
    };
  };
}

export function getGame(): DnD5eGame {
  if (!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game as DnD5eGame;
}

export async function getRules(rule: { journalId: string; pageId: string }) {
  const { journalId, pageId } = rule;
  const rules = await game.packs.get('dnd5e.rules');
  const journal = await rules?.getDocument(journalId);
  const text = (journal as any)?.pages?.get(pageId).text;
  if (!text) {
    console.error(`Unable to find spells' rule journal on compendium ${DEFAULT_PACKS.RULES}`);
  }
  return text;
}

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

export function getLocalizedAbility(ability: string) {
  return game.i18n.localize(`DND5E.Ability${ability.capitalize()}Abbr`);
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
  console.info(`${LOG_PREFIX} | Adding actors directory button`);

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
  console.info(`${LOG_PREFIX} | Adding Create New Actor button`);

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

interface ModuleDataWithApi extends Game.ModuleData<foundry.packages.ModuleData> {
  api?: {
    selectSources: () => void;
    openForNewActor: () => void;
    resetSources: () => void;
  };
}
export function setPublicApi(app: HeroCreationTool) {
  const module: ModuleDataWithApi = game.modules.get(MODULE_ID)!;
  module.api = {
    selectSources: () => {
      const sourcesApp = new CompendiumSourcesSubmenu();
      sourcesApp.render(true);
    },
    openForNewActor: () => app.openForNewActor(),
    resetSources: () => {
      console.info(`${LOG_PREFIX} | Restoring compendium sources to default`);
      setModuleSetting(SettingKeys.SOURCES, DEFAULT_SOURCES);
    },
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

export type Price = { value: number; denomination: string };
export function normalizePriceInGp(price: Price): Price {
  const priceInGp = price.value / getGame().dnd5e.config.currencies[price.denomination].conversion;
  return {
    value: priceInGp,
    denomination: 'gp',
  };
}

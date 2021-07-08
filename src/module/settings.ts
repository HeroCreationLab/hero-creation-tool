import * as Constants from './constants';

export const enum Settings {
  TOKEN_BAR = 'displayBarsMode',
  TOKEN_NAME = 'displayNameMode',
  CLASS_PACKS = 'classCompendiums',
}

export function registerSettings(): void {
  console.log(`${Constants.LOG_PREFIX} | Building module settings`);
  tokenDisplayNameMode();
  tokenDisplayBarsMode();
  classCompendiumSelector();
}

function tokenDisplayBarsMode() {
  game.settings.register(Constants.MODULE_NAME, Settings.TOKEN_BAR, {
    name: game.i18n.localize('HCT.Setting.TokenBarMode.Name'),
    scope: 'world',
    config: true,
    type: Number,
    choices: {
      0: 'Never Displayed',
      10: 'When Controlled',
      20: 'Hover by Owner',
      30: 'Hover by Anyone',
      40: 'Always for Owner',
      50: 'Always for Anyone',
    },
    default: 20,
  });
}

function tokenDisplayNameMode() {
  game.settings.register(Constants.MODULE_NAME, Settings.TOKEN_NAME, {
    name: game.i18n.localize('HCT.Setting.TokenNameMode.Name'),
    scope: 'world',
    config: true,
    type: Number,
    choices: {
      0: 'Never Displayed',
      10: 'When Controlled',
      20: 'Hover by Owner',
      30: 'Hover by Anyone',
      40: 'Always for Owner',
      50: 'Always for Anyone',
    },
    default: 20,
  });
}

function classCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, Settings.CLASS_PACKS, {
    name: game.i18n.localize('HCT.Setting.ClassCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.ClassCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

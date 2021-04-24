import * as Constants from './constants';

export function registerSettings(): void {
  console.log(`${Constants.LOG_PREFIX} | Building module settings`);
  tokenDisplayNameModeSetting();
  tokenDisplayBarsModeSetting();
}

function tokenDisplayBarsModeSetting() {
  game.settings.register(Constants.MODULE_NAME, 'displayBarsMode', {
    name: game.i18n.localize('HCT.Setting.TokenBarMode'),
    scope: 'world',
    config: true,
    choices: {
      '0': 'Never Displayed',
      '10': 'When Controlled',
      '20': 'Hover by Owner',
      '30': 'Hover by Anyone',
      '40': 'Always for Owner',
      '50': 'Always for Anyone',
    },
    default: '20',
  });
}

function tokenDisplayNameModeSetting() {
  game.settings.register(Constants.MODULE_NAME, 'displayNameMode', {
    name: game.i18n.localize('HCT.Setting.TokenNameMode'),
    scope: 'world',
    config: true,
    choices: {
      '0': 'Never Displayed',
      '10': 'When Controlled',
      '20': 'Hover by Owner',
      '30': 'Hover by Anyone',
      '40': 'Always for Owner',
      '50': 'Always for Anyone',
    },
    default: '20',
  });
}

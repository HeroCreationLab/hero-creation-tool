import * as Constants from './constants';

const enum Settings {
  USE_TOKENIZER = 'useTokenizer',
  TOKEN_BAR = 'displayBarsMode',
  TOKEN_NAME = 'displayNameMode',
  RACE_FEATURES_PACK = 'raceFeaturesCompendiums',
  CLASS_PACKS = 'classCompendiums',
  CLASS_FEATURE_PACKS = 'classFeaturesCompendiums',
}
export default Settings;

export function registerSettings(): void {
  console.log(`${Constants.LOG_PREFIX} | Building module settings`);
  useTokenizerIfAvailable();
  tokenDisplayNameMode();
  tokenDisplayBarsMode();
  raceFeaturesCompendiumSelector();
  classCompendiumSelector();
  classFeaturesCompendiumSelector();
}

function useTokenizerIfAvailable() {
  game.settings.register(Constants.MODULE_NAME, Settings.USE_TOKENIZER, {
    name: game.i18n.localize('HCT.Setting.UseTokenizer.Name'),
    hint: game.i18n.localize('HCT.Setting.UseTokenizer.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
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

function classFeaturesCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, Settings.CLASS_FEATURE_PACKS, {
    name: game.i18n.localize('HCT.Setting.ClassFeatureCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.ClassFeatureCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

function raceFeaturesCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, Settings.RACE_FEATURES_PACK, {
    name: game.i18n.localize('HCT.Setting.RaceFeatureCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.RaceFeatureCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

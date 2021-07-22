import * as Constants from './constants';

const enum SettingKeys {
  USE_TOKENIZER = 'useTokenizer',
  TOKEN_BAR = 'displayBarsMode',
  TOKEN_NAME = 'displayNameMode',
  DEFAULT_GOLD_DICE = 'defaultGoldDice',
  CUSTOM_RACE_PACKS = 'raceCompendiums',
  CUSTOM_RACE_FEATURES_PACKS = 'raceFeaturesCompendiums',
  CUSTOM_CLASS_PACKS = 'classCompendiums',
  CUSTOM_CLASS_FEATURE_PACKS = 'classFeaturesCompendiums',
  CUSTOM_BACKGROUND_FEATURE_PACKS = 'backgroundFeaturesCompendiums',
  CUSTOM_SPELL_PACKS = 'spellCompendiums',
}
export default SettingKeys;

export function registerSettings(): void {
  console.log(`${Constants.LOG_PREFIX} | Building module settings`);
  defaultStartingGoldDice();
  tokenDisplayNameMode();
  tokenDisplayBarsMode();
  // custom packs
  raceCompendiumSelector();
  raceFeaturesCompendiumSelector();
  classCompendiumSelector();
  classFeaturesCompendiumSelector();
  backgroundFeaturesCompendiumSelector();
  spellCompendiumSelector();
  // integrations
  useTokenizerIfAvailable();
}

function backgroundFeaturesCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.CUSTOM_BACKGROUND_FEATURE_PACKS, {
    name: game.i18n.localize('HCT.Setting.BackgroundFeatureCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.BackgroundFeatureCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

function spellCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.CUSTOM_SPELL_PACKS, {
    name: game.i18n.localize('HCT.Setting.SpellCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.SpellCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

function defaultStartingGoldDice() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.DEFAULT_GOLD_DICE, {
    name: game.i18n.localize('HCT.Setting.DefaultGoldDice.Name'),
    hint: game.i18n.localize('HCT.Setting.DefaultGoldDice.Hint'),
    scope: 'world',
    config: true,
    default: '5d4 * 10',
    type: String,
  });
}

function useTokenizerIfAvailable() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.USE_TOKENIZER, {
    name: game.i18n.localize('HCT.Setting.UseTokenizer.Name'),
    hint: game.i18n.localize('HCT.Setting.UseTokenizer.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: false,
  });
}

function tokenDisplayBarsMode() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.TOKEN_BAR, {
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
  game.settings.register(Constants.MODULE_NAME, SettingKeys.TOKEN_NAME, {
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
  game.settings.register(Constants.MODULE_NAME, SettingKeys.CUSTOM_CLASS_PACKS, {
    name: game.i18n.localize('HCT.Setting.ClassCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.ClassCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

function classFeaturesCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.CUSTOM_CLASS_FEATURE_PACKS, {
    name: game.i18n.localize('HCT.Setting.ClassFeatureCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.ClassFeatureCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

function raceFeaturesCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.CUSTOM_RACE_FEATURES_PACKS, {
    name: game.i18n.localize('HCT.Setting.RaceFeatureCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.RaceFeatureCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

function raceCompendiumSelector() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.CUSTOM_RACE_PACKS, {
    name: game.i18n.localize('HCT.Setting.RaceCompendiums.Name'),
    hint: game.i18n.localize('HCT.Setting.RaceCompendiums.Hint'),
    scope: 'world',
    config: true,
    type: String,
  });
}

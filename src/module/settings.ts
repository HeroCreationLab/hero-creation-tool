import CompendiumSourcesSubmenu from './CompendiumSourcesSubmenu';
import * as Constants from './constants';

const enum SettingKeys {
  USE_TOKENIZER = 'useTokenizer',
  TOKEN_BAR = 'displayBarsMode',
  TOKEN_NAME = 'displayNameMode',
  SHOW_ROLLS_AS_MESSAGES = 'showRolls',
  ENABLE_ASI_ROLL = 'enableAbilityScoreRolls',
  ENABLE_ASI_POINTBUY = 'enableAbilityScorePointBuy',
  ENABLE_ASI_STANDARD = 'enableAbilityScoreStandardArray',
  ENABLE_ASI_MANUAL = 'enableAbilityScoreManualInput',
  INDIVIDUAL_PANEL_SCROLLS = 'individualScrolls',
  DEFAULT_GOLD_DICE = 'defaultGoldDice',
  FIGHTING_STYLE_STRING = 'fightingStyleLookupString',
  EQUIPMENTS_BLACKLIST = 'equipmentsBlackList',
  SUBRACES_BLACKLIST = 'subracesBlacklist',
  BUTTON_ON_DIALOG = 'buttonOnDialog',
  SOURCES = 'compendiumSources',
}
export default SettingKeys;

export const enum SourceType {
  RACES = 'races',
  RACIAL_FEATURES = 'racialFeatures',
  CLASSES = 'classes',
  CLASS_FEATURES = 'classFeatures',
  BACKGROUND_FEATURES = 'backgroundFeatures',
  SPELLS = 'spells',
  FEATS = 'feats',
}

export type Source = {
  [key in SourceType]: any;
};

export function registerSettings(): void {
  console.log(`${Constants.LOG_PREFIX} | Building module settings`);

  Handlebars.registerHelper('checkedIf', function (condition) {
    return condition ? 'checked' : '';
  });

  defaultStartingGoldDice();
  showRollsAsChatMessages();
  individualPanelScrolls();
  abilityScoreMethods();
  tokenDisplayNameMode();
  tokenDisplayBarsMode();
  fightingStyleLookupString();
  equipmentBlacklist();
  subraceNameBlacklist();
  // custom packs
  sourcesConfiguration();
  buttonOnDialogInsteadOfActorsDirectory();
  // integrations
  useTokenizerIfAvailable();
}

function sourcesConfiguration() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.SOURCES, {
    scope: 'world',
    config: false,
    type: Object,
    default: {
      races: [Constants.DEFAULT_PACKS.RACES],
      racialFeatures: [Constants.DEFAULT_PACKS.RACE_FEATURES],
      classes: [Constants.DEFAULT_PACKS.CLASSES],
      classFeatures: [Constants.DEFAULT_PACKS.CLASS_FEATURES],
      backgroundFeatures: [],
      spells: [Constants.DEFAULT_PACKS.SPELLS],
      feats: [],
    },
  });
  // Define a settings submenu which handles advanced configuration needs
  game.settings.registerMenu(Constants.MODULE_NAME, SettingKeys.SOURCES, {
    name: game.i18n.localize('HCT.Setting.Sources.Name'),
    hint: game.i18n.localize('HCT.Setting.Sources.Hint'),
    label: game.i18n.localize('HCT.Setting.Sources.Label'),
    icon: 'fas fa-atlas',
    type: CompendiumSourcesSubmenu,
    restricted: true,
  });
}

function fightingStyleLookupString() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.FIGHTING_STYLE_STRING, {
    name: game.i18n.localize('HCT.Setting.FightingStyleString.Name'),
    hint: game.i18n.localize('HCT.Setting.FightingStyleString.Hint'),
    scope: 'world',
    config: true,
    default: 'Fighting Style',
    type: String,
  });
}

function equipmentBlacklist() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.EQUIPMENTS_BLACKLIST, {
    name: game.i18n.localize('HCT.Setting.EquipmentBlacklist.Name'),
    hint: game.i18n.localize('HCT.Setting.EquipmentBlacklist.Hint'),
    scope: 'world',
    config: true,
    default:
      'Potion of Climbing; Potion of Healing; Spell Scroll 1st Level; Spell Scroll Cantrip Level; Unarmed Strike',
    type: String,
  });
}

function subraceNameBlacklist() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.SUBRACES_BLACKLIST, {
    name: game.i18n.localize('HCT.Setting.SubraceNameBlacklist.Name'),
    hint: game.i18n.localize('HCT.Setting.SubraceNameBlacklist.Hint'),
    scope: 'world',
    config: true,
    default: 'Gnome Cunning; Halfling Nimbleness',
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

function buttonOnDialogInsteadOfActorsDirectory() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.BUTTON_ON_DIALOG, {
    name: game.i18n.localize('HCT.Setting.ButtonOnDialogInsteadOfActorsDirectory.Name'),
    hint: game.i18n.localize('HCT.Setting.ButtonOnDialogInsteadOfActorsDirectory.Hint'),
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

function showRollsAsChatMessages() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.SHOW_ROLLS_AS_MESSAGES, {
    name: game.i18n.localize('HCT.Setting.ShowRolls.Name'),
    hint: game.i18n.localize('HCT.Setting.ShowRolls.Hint'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });
}

function individualPanelScrolls() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.INDIVIDUAL_PANEL_SCROLLS, {
    name: game.i18n.localize('HCT.Setting.IndividualPanelScroll.Name'),
    hint: game.i18n.localize('HCT.Setting.IndividualPanelScroll.Hint'),
    scope: 'client',
    config: true,
    type: Boolean,
    default: false,
  });
}

function abilityScoreMethods() {
  game.settings.register(Constants.MODULE_NAME, SettingKeys.ENABLE_ASI_ROLL, {
    name: game.i18n.localize('HCT.Setting.AllowAbilityRolling.Name'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(Constants.MODULE_NAME, SettingKeys.ENABLE_ASI_STANDARD, {
    name: game.i18n.localize('HCT.Setting.AllowAbilityStandardArray.Name'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(Constants.MODULE_NAME, SettingKeys.ENABLE_ASI_POINTBUY, {
    name: game.i18n.localize('HCT.Setting.AllowAbilityPointBuy.Name'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });

  game.settings.register(Constants.MODULE_NAME, SettingKeys.ENABLE_ASI_MANUAL, {
    name: game.i18n.localize('HCT.Setting.AllowAbilityInput.Name'),
    scope: 'world',
    config: true,
    type: Boolean,
    default: true,
  });
}

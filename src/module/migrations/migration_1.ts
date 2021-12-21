import { DEFAULT_PACKS, MODULE_NAME } from '../constants';
import SettingKeys from '../settings';

export default () => {
  ui.notifications?.info(game.i18n.format('HCT.Migrations.Info1'));

  game.settings.set(MODULE_NAME, SettingKeys.SOURCES, {
    races: [DEFAULT_PACKS.RACES],
    racialFeatures: [DEFAULT_PACKS.RACE_FEATURES],
    classes: [DEFAULT_PACKS.CLASSES],
    classFeatures: [DEFAULT_PACKS.CLASS_FEATURES],
    backgroundFeatures: [],
    spells: [DEFAULT_PACKS.SPELLS],
    feats: [],
  });
};

import { DEFAULT_PACKS } from '../constants';
import SettingKeys from '../settings';
import { setModuleSetting } from '../utils';

export default async () => {
  ui.notifications?.info(game.i18n.format('HCT.Migrations.Info1'));

  await setModuleSetting(SettingKeys.SOURCES, {
    races: [DEFAULT_PACKS.RACES],
    racialFeatures: [DEFAULT_PACKS.RACE_FEATURES],
    classes: [DEFAULT_PACKS.CLASSES],
    classFeatures: [DEFAULT_PACKS.CLASS_FEATURES],
    backgroundFeatures: [],
    spells: [DEFAULT_PACKS.SPELLS],
    feats: [],
  });
};

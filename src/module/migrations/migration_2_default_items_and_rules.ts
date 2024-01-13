import { DEFAULT_PACKS } from '../constants';
import SettingKeys, { Sources } from '../settings';
import { getModuleSetting, setModuleSetting } from '../utils';

export default async () => {
  ui.notifications?.info(game.i18n.format('HCT.Migrations.Info2'));

  const sourceSettings = getModuleSetting(SettingKeys.SOURCES) as Sources;
  await setModuleSetting(SettingKeys.SOURCES, {
    ...sourceSettings,
    items: [DEFAULT_PACKS.ITEMS],
  });
};

import { DEFAULT_PACKS } from '../constants';
import SettingKeys, { Source } from '../settings';
import { getModuleSetting, setModuleSetting } from '../utils';

export default async () => {
  ui.notifications?.info(game.i18n.format('HCT.Migrations.Info3'));

  const sourceSettings = getModuleSetting(SettingKeys.SOURCES) as Source;
  const newSourceSettings = {
    ...sourceSettings,
    backgrounds: [DEFAULT_PACKS.BACKGROUNDS],
  };
  delete (newSourceSettings as any).backgroundFeatures; // remove old Background Features key on sources

  await setModuleSetting(SettingKeys.SOURCES, newSourceSettings);
};

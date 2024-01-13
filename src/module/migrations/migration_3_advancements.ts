import { DEFAULT_PACKS } from '../constants';
import SettingKeys, { Sources } from '../settings';
import { getModuleSetting, setModuleSetting } from '../utils';

export default async () => {
  ui.notifications?.info(game.i18n.format('HCT.Migrations.Info3'));

  const sourceSettings = getModuleSetting(SettingKeys.SOURCES) as Sources;
  const newSourceSettings = {
    ...sourceSettings,
    backgrounds: [DEFAULT_PACKS.BACKGROUNDS],
    subclasses: [DEFAULT_PACKS.SUBCLASSES],
  };
  delete (newSourceSettings as any).backgroundFeatures; // remove old Background Features key on sources
  delete (newSourceSettings as any).classFeatures; // remove old Class Features key on sources

  await setModuleSetting(SettingKeys.SOURCES, newSourceSettings);
};

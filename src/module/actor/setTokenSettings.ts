import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MODULE_ID } from '../constants';
import SettingKeys from '../settings';

export function setTokenSettings(newActor: ActorDataConstructorData) {
  const displayBarsSetting = game.settings.get(MODULE_ID, SettingKeys.TOKEN_BAR);
  setProperty(newActor, 'token.displayBars', displayBarsSetting);

  const displayNameSetting = game.settings.get(MODULE_ID, SettingKeys.TOKEN_NAME);
  setProperty(newActor, 'token.displayName', displayNameSetting);

  const dimSight = (newActor?.data as any)?.attributes?.senses?.darkvision ?? 0;
  setProperty(newActor, 'token.dimSight', dimSight);
}

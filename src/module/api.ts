import CompendiumSourcesSubmenu from './compendiumSourcesSubmenu';
import { MODULE_ID, LOG_PREFIX, DEFAULT_SOURCES } from './constants';
import HeroCreationTool from './heroCreationToolApp';
import SettingKeys from './settings';
import { setModuleSetting } from './utils';

interface HeroCreationToolApi {
  api?: {
    selectSources: () => void;
    openForNewActor: () => void;
    resetSources: () => void;
  };
}
export function setPublicApi(app: HeroCreationTool) {
  const module: Game.ModuleData<any> & HeroCreationToolApi = game.modules.get(MODULE_ID)!;
  module.api = {
    selectSources: () => {
      const sourcesApp = new CompendiumSourcesSubmenu();
      sourcesApp.render(true);
    },
    openForNewActor: () => app.openForNewActor(),
    resetSources: () => {
      console.info(`${LOG_PREFIX} | Restoring compendium sources to default`);
      setModuleSetting(SettingKeys.SOURCES, DEFAULT_SOURCES);
    },
  };
}

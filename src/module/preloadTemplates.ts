import * as Constants from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  console.log(`${Constants.LOG_PREFIX} | Loading templates`);

  const templatePaths: string[] = [
    Constants.MODULE_PATH + '/templates/nav.html',
    Constants.MODULE_PATH + '/templates/tabs/abilities.html',
    Constants.MODULE_PATH + '/templates/tabs/background.html',
    Constants.MODULE_PATH + '/templates/tabs/basics.html',
    Constants.MODULE_PATH + '/templates/tabs/bio.html',
    Constants.MODULE_PATH + '/templates/tabs/class.html',
    Constants.MODULE_PATH + '/templates/tabs/equipment.html',
    Constants.MODULE_PATH + '/templates/tabs/race.html',
    Constants.MODULE_PATH + '/templates/tabs/spells.html',
    Constants.MODULE_PATH + '/templates/tabs/start.html',
  ];

  return loadTemplates(templatePaths);
}

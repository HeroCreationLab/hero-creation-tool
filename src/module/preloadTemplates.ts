import { LOG_PREFIX, MODULE_ID } from './constants';

export async function preloadTemplates(): Promise<Handlebars.TemplateDelegate[]> {
  console.info(`${LOG_PREFIX} | Loading templates`);

  const templatePaths: string[] = [
    `modules/${MODULE_ID}/templates/nav-tabs.html`,
    `modules/${MODULE_ID}/templates/footer.html`,
    `modules/${MODULE_ID}/templates/tabs/abilities.html`,
    `modules/${MODULE_ID}/templates/tabs/background.html`,
    `modules/${MODULE_ID}/templates/tabs/basics.html`,
    `modules/${MODULE_ID}/templates/tabs/bio.html`,
    `modules/${MODULE_ID}/templates/tabs/class.html`,
    `modules/${MODULE_ID}/templates/tabs/equipment.html`,
    `modules/${MODULE_ID}/templates/tabs/race.html`,
    `modules/${MODULE_ID}/templates/tabs/spells.html`,
    `modules/${MODULE_ID}/templates/tabs/start.html`,
  ];

  return loadTemplates(templatePaths);
}

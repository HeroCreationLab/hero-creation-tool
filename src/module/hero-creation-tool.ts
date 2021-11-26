import { registerSettings } from './settings';
import { preloadTemplates } from './preloadTemplates';
import HeroCreationTool from './HeroCreationToolApp';
import { buildEquipmentAndJournalIndexes, buildSourceIndexes } from './indexUtils';
import { addActorDirectoryButton } from './utils';

const heroCreationTool = new HeroCreationTool();

// Initialize module
Hooks.once('init', async () => {
  registerSettings();
  await preloadTemplates();
});

// Build indexes on ready
Hooks.once('ready', async () => {
  await buildEquipmentAndJournalIndexes();
});

Hooks.on('renderHeroCreationTool', async function (app: any, html: any, data: any) {
  await buildSourceIndexes();
  await heroCreationTool.setupData();
  heroCreationTool.renderChildrenData();
});

// Rendering the button on Actor's directory
Hooks.on('renderActorDirectory', () => {
  addActorDirectoryButton(heroCreationTool);
});

// This hooks onto the rendering actor sheet to show the button
// Hooks.on('renderActorSheet5eCharacter', (app: any, html: HTMLElement, data: any) => {
//   const $experienceDiv = document.getElementsByClassName('experience')[0];
//   const $currentExpInput = $experienceDiv.querySelector('[name="data.details.xp.value"]')!;
//   const maxExp = parseInt(($experienceDiv.querySelector('.max') as HTMLSpanElement).innerText ?? '0');
//   const currentExp = parseInt(($currentExpInput as HTMLInputElement).value) ?? 0;

//   if (currentExp >= maxExp) {
//     const $levelUpButton = document.createElement('button');
//     $levelUpButton.id = 'hct-level-up';
//     $levelUpButton.setAttribute('type', 'button');
//     $levelUpButton.style.display = 'block';
//     $levelUpButton.appendChild(document.createTextNode(game.i18n.localize('HCT.ActorLevelUpButton')));
//     $levelUpButton.addEventListener('click', async () => {
//       const actor = game.actors?.get(data.actor._id);
//       if (!actor) throw new Error(`Unable to find actor for id ${data.actor._id}`);
//       heroCreationTool.openForActor(actor);
//       app.close();
//     });

//     $currentExpInput.before($levelUpButton);
//   }
// });

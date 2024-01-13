import { LOG_PREFIX, MODULE_ID } from '../constants';
import SettingKeys, { Sources } from '../settings';
import * as AddFields from './addFields';

/***
 * Builds the indexes for all sources.
 * (note that items without a source compendium are not indexed,
 *  like Class Features or Backgrounds, as they are taken from advancements)
 */
export async function buildIndexes() {
  console.info(`${LOG_PREFIX} | Indexing source compendiums`);
  const sourcePacks: Sources = (await game.settings.get(MODULE_ID, SettingKeys.SOURCES)) as Sources;
  const itemsPromises: Promise<Item | null | undefined>[] = [];
  game.packs
    .filter((p) => p.documentName == 'Item')
    .forEach((p) => {
      const name = p.collection;
      const fieldsToIndex = new Set<string>();

      // name added by default on all when indexed
      AddFields.addRaceFields(fieldsToIndex, sourcePacks, name);
      AddFields.addRacialFeaturesFields(fieldsToIndex, sourcePacks, name);
      AddFields.addClassFields(fieldsToIndex, sourcePacks, name);
      AddFields.addSubclassFields(fieldsToIndex, sourcePacks, name);
      AddFields.addSpellFields(fieldsToIndex, sourcePacks, name);
      AddFields.addFeatFields(fieldsToIndex, sourcePacks, name);
      AddFields.addBackgroundFields(fieldsToIndex, sourcePacks, name);
      AddFields.addEquipmentFields(fieldsToIndex, sourcePacks, name);

      if (fieldsToIndex.size) {
        fieldsToIndex.add('img');
        itemsPromises.push((p as any).getIndex({ fields: [...fieldsToIndex] }));
      }
    });
  await Promise.all(itemsPromises);
}

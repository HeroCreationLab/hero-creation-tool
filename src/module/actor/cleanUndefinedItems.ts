import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';

export function cleanUndefinedItems(newActor: ActorDataConstructorData) {
  let items = getProperty(newActor, 'items');
  items = items?.filter(Boolean); // filter undefined items
  if (items) setProperty(newActor, 'items', items);
  else delete newActor.items;
}

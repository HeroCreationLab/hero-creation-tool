import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import { MYSTERY_MAN } from '../constants';
import { IndexEntry } from '../indexes/entries/indexEntry';

export function initializeActorData() {
  const newActor: ActorDataConstructorData & { items: IndexEntry[] } = {
    name: '',
    type: 'character',
    sort: 12000,
    img: MYSTERY_MAN,
    token: {
      actorLink: true,
      disposition: 1,
      img: MYSTERY_MAN,
      vision: true,
      dimSight: 0,
      bar1: { attribute: 'attributes.hp' },
      displayBars: 0,
      displayName: 0,
    },
    items: [],
  };
  return newActor;
}

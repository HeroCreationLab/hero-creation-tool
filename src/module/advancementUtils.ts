import { IndexEntry } from './indexes/indexUtils';
import { getGame } from './utils';

interface AdvancementConfiguration {
  byId: {
    [id: string]: Advancement;
  };
  byLevel: {
    [lv: number]: Advancement[];
  };
  byType: {
    HitPoints: HitPointsAdvancement[];
    ItemGrant: ItemGrantAdvancement[];
    ScaleValue: ScaleValueAdvancement[];
  };
}

interface Advancement {
  id: string;
  title: string;
  icon: string;
  levels: number[];
}

interface HitPointsAdvancement extends Advancement {
  hitDie: string;
  hitDieValue: number;
}

interface ItemGrantAdvancement extends Advancement {
  data: {
    configuration: {
      items: string[];
    };
  };
}

interface ScaleValueAdvancement extends Advancement {
  identifier: string;
  data: {
    configuration: {
      identifier: string;
      type: 'number';
      scale: {
        [lv: number]: { value: number };
      };
    };
  };
}

export function hasAdvancements(item: any): item is { advancement: AdvancementConfiguration } {
  return item.advancement;
}

export async function getAdvancementsUpToLevel(entry: IndexEntry, maxLevel: number) {
  if (!entry._pack || !entry._id) return;

  const item = await getGame().packs.get(entry._pack)?.getDocument(entry._id); // FIXME remove when advancements are indexed
  if (!item) throw new Error(`Unable to find item id [${entry._id}] in pack [${entry._pack}]`); // FIXME i18n this
  if (!hasAdvancements(item)) {
    return [];
  }

  return Object.keys(item.advancement.byLevel)
    .map(Number)
    .filter((lv) => lv <= maxLevel)
    .flatMap((lv) => item.advancement.byLevel[lv]);
}

export function filterItemGrantAdvancements(advancements: Advancement[]): ItemGrantAdvancement[] {
  return advancements.filter(
    (adv) => adv instanceof getGame().dnd5e.advancement.types.ItemGrantAdvancement,
  ) as ItemGrantAdvancement[];
}

export function filterHitPointsAdvancements(advancements: Advancement[]): HitPointsAdvancement[] {
  return advancements.filter(
    (adv) => adv instanceof getGame().dnd5e.advancement.types.HitPointsAdvancement,
  ) as HitPointsAdvancement[];
}

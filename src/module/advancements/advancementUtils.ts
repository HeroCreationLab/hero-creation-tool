import { getIndexEntryByUuid } from '../indexes/indexUtils';
import { AdvancementEntry, ItemGrantAdvancementEntry } from '../indexes/entries/advancementEntry';
import { IndexEntry } from '../indexes/entries/indexEntry';

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

export function getItemGrantAdvancementsUpToLevel(
  entry: IndexEntry & { system: { advancement: AdvancementEntry[] } },
  maxLevel: number,
): ItemGrantAdvancementEntry[] {
  return entry.system.advancement.filter(
    (a) => a.type === 'ItemGrant' && maxLevel >= (a as ItemGrantAdvancementEntry).level,
  ) as ItemGrantAdvancementEntry[];
}

export function getScaleValueAdvancements(
  entry: IndexEntry & { system: { advancement: AdvancementEntry[] } },
): ItemGrantAdvancementEntry[] {
  return entry.system.advancement.filter((a) => a.type === 'ScaleValue') as ItemGrantAdvancementEntry[];
}

export async function buildAdvancementMetadataForEntry(entry: {
  _uuid: string;
  _advancement: { id: string; uuid: string; lv?: number };
}) {
  return {
    ...(await getIndexEntryByUuid(entry._uuid)),
    _advancement: entry._advancement,
  };
}

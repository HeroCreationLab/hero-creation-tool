import { Advancement } from '../advancements/advancement';

export const itemHasAdvancements = (
  item: Item,
): item is Item & {
  system: { advancement: Advancement[] };
} => (item as any)?.system?.advancement;

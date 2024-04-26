import HeroOption from '../options/heroOption';
import { TraitAdvancement } from '../advancements/traitAdvancement';

export function buildConfiguredTraitAdvancement(
  advancement: TraitAdvancement,
  advancementOptions: HeroOption[],
): TraitAdvancement {
  // const option = advancementOptions.find((opt) => opt);

  return {
    ...advancement,
    value: {
      chosen: new Set(),
    },
  };
}

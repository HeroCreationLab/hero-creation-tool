import HeroOption from '../options/heroOption';
import { SizeAdvancement } from '../advancements/sizeAdvancement';

export function buildConfiguredSizeAdvancement(
  sizeAdvancement: SizeAdvancement,
  stepAdvancementOptions: HeroOption[],
): SizeAdvancement {
  const sizeOption = stepAdvancementOptions.find((opt) => opt);

  return {
    ...sizeAdvancement,
    value: {
      size: sizeOption ? sizeOption.value() : 'med',
    },
  };
}

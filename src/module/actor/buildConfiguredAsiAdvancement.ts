import HeroOption from '../options/heroOption';
import { AbilityScoreAdvancement } from '../advancements/abilityScoreAdvancement';

export function buildConfiguredAsiAdvancement(
  abilityScoreAdvancement: AbilityScoreAdvancement,
  stepAdvancementOptions: HeroOption[],
): AbilityScoreAdvancement {
  const assignments: Record<string, number> = {};

  for (const step of stepAdvancementOptions) {
    if (step.value() > 0) {
      const abilityKey = step.key.split('.')[2]; // `data.abilities.${ability}.value`
      assignments[abilityKey] = Number(step.value());
    }
  }

  return {
    ...abilityScoreAdvancement,
    value: {
      type: 'asi',
      feat: undefined,
      assignments: assignments,
    },
  };
}

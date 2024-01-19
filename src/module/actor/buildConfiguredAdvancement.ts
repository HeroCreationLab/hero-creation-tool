import HeroOption from '../options/heroOption';
import { AbilityScoreAdvancement } from '../advancements/abilityScoreAdvancement';
import { buildConfiguredAsiAdvancement } from './buildConfiguredAsiAdvancement';
import { Advancement } from '../advancements/advancement';
import { SizeAdvancement } from '../advancements/sizeAdvancement';
import { buildConfiguredSizeAdvancement } from './buildConfiguredSizeAdvancement';
import { AdvancementType } from '../advancements/advancementType';

export function buildConfiguredAdvancement(adv: Advancement, stepOptions: HeroOption[]): Advancement {
  switch (adv.type as AdvancementType) {
    case AdvancementType.ABILITY_SCORE_IMPROVEMENT:
      return buildConfiguredAsiAdvancement(adv as AbilityScoreAdvancement, stepOptions);

    case AdvancementType.SIZE:
      return buildConfiguredSizeAdvancement(adv as SizeAdvancement, stepOptions);

    case AdvancementType.HIT_POINTS:
      console.warn('skipping HIT POINTS advancement');
      return adv;

    case AdvancementType.ITEM_GRANT:
      console.warn('skipping ITEM_GRANT advancement');
      return adv;

    case AdvancementType.SCALE_VALUE:
      console.warn('skipping SCALE_VALUE advancement');
      return adv;

    default:
      console.warn(`skipping ${adv.type} advancement`);
      return adv;
  }
}

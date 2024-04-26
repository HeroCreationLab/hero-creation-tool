import HeroOption from '../options/heroOption';
import { buildConfiguredAsiAdvancement } from './buildConfiguredAsiAdvancement';
import { Advancement } from '../advancements/advancement';
import { buildConfiguredSizeAdvancement } from './buildConfiguredSizeAdvancement';
import { AdvancementType } from '../advancements/advancementType';
import { buildConfiguredTraitAdvancement } from './buildConfiguredTraitAdvancement';

export function buildConfiguredAdvancement(adv: Advancement, stepOptions: HeroOption[]): Advancement {
  if (adv.type === AdvancementType.ABILITY_SCORE_IMPROVEMENT) {
    return buildConfiguredAsiAdvancement(adv, stepOptions);
  }

  if (adv.type === AdvancementType.SIZE) {
    return buildConfiguredSizeAdvancement(adv, stepOptions);
  }

  if (adv.type === AdvancementType.TRAIT) {
    return buildConfiguredTraitAdvancement(adv, stepOptions);
  }

  if (adv.type === AdvancementType.HIT_POINTS) {
    console.warn('skipping HIT POINTS advancement');
    return adv;
  }

  if (adv.type === AdvancementType.ITEM_GRANT) {
    console.warn('skipping ITEM_GRANT advancement');
    return adv;
  }

  if (adv.type === AdvancementType.SCALE_VALUE) {
    console.warn('skipping SCALE_VALUE advancement');
    return adv;
  }

  console.warn(`skipping ${(adv as any).type} advancement`);
  return adv;
}

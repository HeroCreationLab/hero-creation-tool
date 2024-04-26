import { AbilityScoreAdvancement } from './abilityScoreAdvancement';
import { HitPointsAdvancement } from './hitPointsAdvancement';
import { ItemGrantAdvancement } from './itemGrantAdvancement';
import { ScaleValueAdvancement } from './scaleValueAdvancement';
import { SizeAdvancement } from './sizeAdvancement';
import { TraitAdvancement } from './traitAdvancement';

export type Advancement =
  | AbilityScoreAdvancement
  | SizeAdvancement
  | TraitAdvancement<string> // TODO type this properly
  | HitPointsAdvancement
  | ItemGrantAdvancement
  | ScaleValueAdvancement;

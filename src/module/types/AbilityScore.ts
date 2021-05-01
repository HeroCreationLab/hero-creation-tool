export enum AbilityScore {
  Strength = 'Str',
  Dexterity = 'Dex',
  Constitution = 'Con',
  Intelligence = 'Int',
  Wisdom = 'Wis',
  Charisma = 'Cha',
}

export const AbilityScoreLabel: { [key in AbilityScore]: string } = {
  [AbilityScore.Strength]: 'DND5E.AbilityStr',
  [AbilityScore.Dexterity]: 'DND5E.AbilityDex',
  [AbilityScore.Constitution]: 'DND5E.AbilityCon',
  [AbilityScore.Intelligence]: 'DND5E.AbilityInt',
  [AbilityScore.Wisdom]: 'DND5E.AbilityWis',
  [AbilityScore.Charisma]: 'DND5E.AbilityCha',
};

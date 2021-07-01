export enum Ability {
  Strength = 'Str',
  Dexterity = 'Dex',
  Constitution = 'Con',
  Intelligence = 'Int',
  Wisdom = 'Wis',
  Charisma = 'Cha',
}

export const AbilityScoreLabel: { [key in Ability]: string } = {
  [Ability.Strength]: 'DND5E.AbilityStr',
  [Ability.Dexterity]: 'DND5E.AbilityDex',
  [Ability.Constitution]: 'DND5E.AbilityCon',
  [Ability.Intelligence]: 'DND5E.AbilityInt',
  [Ability.Wisdom]: 'DND5E.AbilityWis',
  [Ability.Charisma]: 'DND5E.AbilityCha',
};

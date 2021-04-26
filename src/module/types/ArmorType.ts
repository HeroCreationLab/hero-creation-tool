export enum ArmorType {
  Shields = 'shl',
  Light = 'lgt',
  Medium = 'med',
  Heavy = 'hvy',
}

export const ArmorTypeLabel: { [key in ArmorType]: string } = {
  [ArmorType.Shields]: 'DND5E.EquipmentShieldProficiency',
  [ArmorType.Light]: 'DND5E.EquipmentLight',
  [ArmorType.Medium]: 'DND5E.EquipmentMedium',
  [ArmorType.Heavy]: 'DND5E.EquipmentHeavy',
};

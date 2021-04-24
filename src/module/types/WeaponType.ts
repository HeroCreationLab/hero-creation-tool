export enum WeaponType {
  Simple = 'sim',
  Martial = 'mar',
}

export const WeaponTypeLabel: { [key in WeaponType]: string } = {
  [WeaponType.Simple]: 'DND5E.WeaponSimpleProficiency',
  [WeaponType.Martial]: 'DND5E.WeaponMartialProficiency',
};

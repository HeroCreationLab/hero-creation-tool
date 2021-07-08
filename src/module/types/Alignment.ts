export enum Alignment {
  LawfulGood,
  NeutralGood,
  ChaoticGood,
  LawfulNeutral,
  TrueNeutral,
  ChaoticNeutral,
  LawfulEvil,
  NeutralEvil,
  ChaoticEvil,
}

export const AlignmentLabel: { [key in Alignment]: string } = {
  [Alignment.LawfulGood]: 'DND5E.AlignmentLG',
  [Alignment.NeutralGood]: 'DND5E.AlignmentNG',
  [Alignment.ChaoticGood]: 'DND5E.AlignmentCG',
  [Alignment.LawfulNeutral]: 'DND5E.AlignmentLN',
  [Alignment.TrueNeutral]: 'DND5E.AlignmentTN',
  [Alignment.ChaoticNeutral]: 'DND5E.AlignmentCN',
  [Alignment.LawfulEvil]: 'DND5E.AlignmentLE',
  [Alignment.NeutralEvil]: 'DND5E.AlignmentNE',
  [Alignment.ChaoticEvil]: 'DND5E.AlignmentCE',
};

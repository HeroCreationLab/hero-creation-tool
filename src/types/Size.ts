export enum Size {
    Tiny = 'tiny',
    Small = 'sm',
    Medium = 'med',
    Large = 'lg',
    Huge = 'huge',
    Gargantuan = 'grg',
}

// use this function when displaying these on screen
export const SizeLabel: { [key in Size]: string } = {
    [Size.Tiny]: "DND5E.SizeTiny",
    [Size.Small]: "DND5E.SizeSmall",
    [Size.Medium]: "DND5E.SizeMedium",
    [Size.Large]: "DND5E.SizeLarge",
    [Size.Huge]: "DND5E.SizeHuge",
    [Size.Gargantuan]: "DND5E.SizeGargantuan",
};
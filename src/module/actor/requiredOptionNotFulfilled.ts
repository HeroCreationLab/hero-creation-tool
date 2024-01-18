import HeroOption from '../options/heroOption';

export function requiredOptionNotFulfilled(opt: HeroOption): boolean {
  const key = opt.key;
  if (key === 'name' && !opt.isFulfilled()) {
    const errorMessage = game.i18n.format('HCT.Error.RequiredOptionNotFulfilled', { opt: opt.key });
    ui.notifications?.error(errorMessage);
    return true;
  }
  return false;
}

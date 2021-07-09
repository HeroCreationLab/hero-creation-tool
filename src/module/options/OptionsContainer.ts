import HeroOption from './HeroOption';

export default class OptionsContainer {
  constructor(readonly title: string, public options: HeroOption[] = []) {}

  render(parent: JQuery): void {
    const $container: JQuery = $(
      `<div class="hct-options-container"><p class="hct-options-container-label">${this.title}</p></div>`,
    );
    this.options.forEach((o) => o.render($container));
    parent.append($container);
  }
}

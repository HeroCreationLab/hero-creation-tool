import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';
import * as Constants from '../constants';

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SelectableItemOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    readonly options: Item[],
    readonly settings: {
      addValues: boolean;
    } = { addValues: false },
  ) {
    this.optionsMap = new Map(options.map((i) => [foundry.utils.randomID(), i]));
  }

  optionsMap: Map<string, Item>;

  isFulfilled() {
    return !!this.value();
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(actor, this.key, [this.value()], this.settings.addValues);
  }

  $itemImg!: JQuery;
  $select!: JQuery;
  $link!: JQuery;

  render($parent: JQuery): void {
    const $container = $('<div class="hct-icon-with-context">');
    this.$link = $(`<a class="entity-link hct-icon-link" draggable="false" data-pack="" data-id="">`);
    this.$itemImg = $('<img class="hct-icon">');
    this.$select = $(`<select class="hct-width-full">`);

    this.$link.append(this.$itemImg);
    $container.append(this.$link);
    this.optionsMap.forEach((item, key) => {
      const $opt = $(`<option value="${key}">${item.name}</option>`);
      this.$select.append($opt);
    });
    this.$select.on('change', () => {
      const val = this.$select.val();
      const item = this.optionsMap.get(val as string) as Item;
      this.$itemImg.attr('src', item.img || Constants.MYSTERY_MAN);
      const linkData = (item as any).flags?.hct?.link;
      this.$link.attr('data-pack', linkData?.pack);
      this.$link.attr('data-id', linkData?.id);
    });
    $container.append(this.$select);
    $parent.append($container);
    this.$select.trigger('change');
  }

  value(): any {
    const val = this.$select.val();
    if (val) {
      return this.optionsMap.get(val as string);
    }
  }
}

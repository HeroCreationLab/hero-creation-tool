import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';
import * as Constants from '../constants';
import { IndexEntry } from '../indexUtils';

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SelectableIndexEntryOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    readonly options: IndexEntry[],
    readonly settings: {
      addValues: boolean;
      placeholderName?: string;
    } = { addValues: false },
  ) {
    this.optionsMap = new Map(
      options.map((i) => [i.name === this.settings.placeholderName ? '' : foundry.utils.randomID(), i]),
    );
  }

  optionsMap: Map<string, IndexEntry>;

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
    this.$select = $(`<select class="hct-overflow-ellipsis hct-width-195">`);

    this.$link.append(this.$itemImg);
    $container.append(this.$link);
    this.optionsMap.forEach((item, key) => {
      const placeholder = item.name === this.settings.placeholderName ? 'selected disabled' : '';
      const $opt = $(`<option class="hct-overflow-ellipsis" value="${key}" ${placeholder}>${item.name}</option>`);
      this.$select.append($opt);
    });
    this.$select.on('change', () => {
      const val = this.$select.val();
      const item = this.optionsMap.get((val as string) ?? '')!;
      this.$itemImg.attr('src', item.img || Constants.MYSTERY_MAN);
      this.$link.attr('data-pack', item._pack);
      this.$link.attr('data-id', item._id);
    });
    $container.append(this.$select);
    $parent.append($container);
    this.$select.trigger('change');
  }

  value(): any {
    const val = this.$select.val() ?? '';
    return this.optionsMap.get(val as string);
  }
}

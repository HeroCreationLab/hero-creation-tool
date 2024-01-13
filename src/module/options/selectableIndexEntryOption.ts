import { StepEnum } from '../step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './heroOption';
import { IndexEntry } from '../indexes/indexEntry';
import { MYSTERY_MAN } from '../constants';

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SelectableIndexEntryOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly key: 'items',
    readonly options: IndexEntry[],
    readonly settings: {
      addValues: boolean;
      placeholderName?: string;
      placeholder?: IndexEntry;
    } = { addValues: false },
  ) {
    if (this.settings.placeholder) {
      this.options.unshift(this.settings.placeholder);
    }
    this.optionsMap = new Map(
      options.map((i) => [
        i.name === this.settings.placeholderName || i.name == this.settings.placeholder?.name
          ? ''
          : foundry.utils.randomID(),
        i,
      ]),
    );
    if (this.settings.placeholder) {
      this.optionsMap.set('', this.settings.placeholder);
    }
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
    this.$link = $(`<a class="content-link hct-icon-link hct-grow-0" draggable="false" data-uuid="">`);
    this.$itemImg = $('<img class="hct-icon hct-border-0 hct-border-rad-tiny hct-hover-shadow-accent">');
    this.$select = $(`<select class="hct-grow">`);

    this.$link.append(this.$itemImg);
    $container.append(this.$link);
    this.optionsMap.forEach((item, key) => {
      const placeholderProps =
        item.name === this.settings.placeholderName || item.name === this.settings.placeholder?.name
          ? 'selected disabled'
          : '';
      const $opt = $(`<option class="hct-text-ellipsis" value="${key}" ${placeholderProps}>${item.name}</option>`);
      this.$select.append($opt);
    });
    this.$select.on('change', () => {
      const val = this.$select.val();
      const item = this.optionsMap.get((val as string) ?? '')!;
      this.$itemImg.attr('src', item.img || MYSTERY_MAN);
      this.$link.attr('data-uuid', item._uuid);
    });
    $container.append(this.$select);
    $parent.append($container);
    this.$select.trigger('change');
  }

  value(): IndexEntry | null {
    const val = this.$select.val() ?? '';
    if (val === '') return null;
    return this.optionsMap.get(val as string) ?? null;
  }
}

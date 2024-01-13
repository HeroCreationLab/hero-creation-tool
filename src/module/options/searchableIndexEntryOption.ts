import { StepEnum } from '../step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './heroOption';
import { IndexEntry } from '../indexes/entries/indexEntry';
import { MYSTERY_MAN, NONE_ICON } from '../constants';

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SearchableIndexEntryOption implements HeroOption {
  readonly settings: {
    addValues: boolean;
    customizable: boolean;
  } = { addValues: true, customizable: false };

  constructor(
    readonly origin: StepEnum,
    readonly key: 'items',
    private options: IndexEntry[],
    private selectCallback: (id: string | null) => any,
    private placeholder?: string,
    readonly hideImage?: boolean,
  ) {
    this.options = [this.noneOption, ...options];
    this.searchArray = [];
  }

  private noneOption: IndexEntry = {
    _id: 'none',
    _pack: '',
    _uuid: '',
    name: 'None',
    img: NONE_ICON,
    type: 'none',
  };

  isFulfilled() {
    return !!this.value() && this.value() !== this.noneOption;
  }

  applyToHero(actor: ActorDataConstructorData) {
    if (this.isFulfilled()) {
      apply(actor, this.key, [this.value()], this.settings.addValues);
    }
  }

  private $input!: JQuery;
  private $img!: HTMLImageElement;
  private $link!: JQuery;
  private $resultBox!: JQuery;
  private searchArray: Array<IndexEntry>;
  private selected?: IndexEntry;

  render($parent: JQuery, options?: { prepend: boolean }): void {
    const $container = $('<div class="hct-icon-with-context">');
    if (!this.hideImage) {
      const item = this.value();
      this.$link = item?.local
        ? $(
            `<a class="content-link hct-icon-link" draggable="false" data-type="Item" data-uuid="${item._uuid}" data-entity="Item">`,
          )
        : $(`<a class="content-link hct-icon-link" draggable="false" data-uuid="${item?._uuid}">`);
      this.$img = document.createElement('img');
      this.$img.classList.add('hct-icon');
      this.$img.classList.add('hct-border-0');
      this.$img.classList.add('hct-border-rad-tiny');
      this.$img.classList.add('hct-hover-shadow-accent');
      this.$img.src = item?.img ?? MYSTERY_MAN;
      this.$link.append(this.$img);
      $container.append(this.$link);
    }

    const $form = $(`<form data-hct-searchbar autocomplete="off">`);
    const $searchWrapper = $(`<div class="hct-search-wrapper">`);
    this.$input = $(
      `<input type="text" placeholder="${this.placeholder ?? game.i18n.localize('HCT.Common.Searchbar.Placeholder')}">`,
    );
    this.$input.on('click', (e: any) => {
      if (this.$input.val() == '') {
        this.searchArray = this.options;
      }
      this.$input.trigger('select');
      $searchWrapper.addClass('active');
      this.showSuggestions(this.searchArray);
      this.setSuggestionsInteraction($searchWrapper);
    });
    this.$input.on('keyup', (e: any) => {
      const userInput = (e.target as any).value;
      if (userInput) {
        this.searchArray = this.options.filter((value) => {
          return (value.name as any)
            .toLocaleLowerCase()
            .replaceAll(/\s/g, '')
            .includes(userInput.toLocaleLowerCase().replaceAll(/\s/g, ''));
        });
        $searchWrapper.addClass('active');
        this.showSuggestions(this.searchArray);
        this.setSuggestionsInteraction($searchWrapper);
      } else {
        $searchWrapper.removeClass('active');
      }
    });
    $searchWrapper.append(this.$input);

    this.$resultBox = $(`<div class="hct-search-autocom-box" data-hct-searchbar-results>`);
    $searchWrapper.append(this.$resultBox);

    $form.append($searchWrapper);
    $container.append($form);
    $form.on('submit', (e) => false);
    if (options?.prepend) {
      $parent.prepend($container);
    } else {
      $parent.append($container);
    }
  }

  private setSuggestionsInteraction($searchWrapper: JQuery<HTMLElement>) {
    $('div', this.$resultBox).on('click', (event) => {
      const id = $(event.currentTarget).data('key');
      $searchWrapper.removeClass('active');
      this.selected = this.options.find((o) => o._id === id || o.name === id); // Results use id, Items use name
      this.$input.val(this.selected?.name ?? id);

      this.selectCallback(id !== 'none' ? id : null);
      if (!this.hideImage) {
        this.$img.src = id !== 'none' ? this.selected?.img ?? MYSTERY_MAN : NONE_ICON;

        this.$link.attr('data-uuid', this.selected!._uuid);
        if (this.selected?.local) {
          this.$link.attr('data-type', 'Item');
          this.$link.attr('data-entity', 'Item');
        }
      }
    });
  }

  value(): IndexEntry | undefined {
    return this.selected;
  }

  showSuggestions(searchArray: Array<IndexEntry>) {
    let listData;
    if (!searchArray.length) {
      listData = `<li>${'No matches'}</li>`;
    } else {
      listData = searchArray
        .map(
          (result) =>
            `<li>
              <div class="hct-icon-with-context" data-key=\"${result._id ?? result.name}\">
                <img class="hct-icon-square-med hct-bg-black hct-border-0" src="${result.img ?? MYSTERY_MAN}">
                <span>${result.name}</span>
              </div>
            </li>`,
        )
        .join('');
    }
    this.$resultBox.html(listData);
  }
}

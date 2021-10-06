import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import * as Constants from '../constants';
import HeroOption, { apply } from './HeroOption';

type Result = { key: string; name: string; img: string };

/**
 * Represents a value needs to be selected by the player with a single output onto the created actor.
 * (e.g. Dwarven's Tool Proficiency is a single option between three defined ones)
 * @class
 */
export default class SearchableItemOption implements HeroOption {
  readonly settings: {
    addValues: boolean;
    default?: string;
    customizable: boolean;
  } = { addValues: false, customizable: false };

  constructor(
    readonly origin: StepEnum,
    readonly key: string,
    private options: Array<Result>,
    private selectCallback: (key: string) => any,
  ) {
    this.searchArray = [];
  }

  isFulfilled() {
    return !!this.value();
  }

  applyToHero(actor: ActorDataConstructorData) {
    apply(actor, this.key, this.value(), this.settings.addValues);
  }

  $input!: JQuery;
  $resultBox!: JQuery;
  searchArray: Result[];

  render($parent: JQuery, options?: { beforeParent: boolean }): void {
    const $form = $(`<form data-hct-searchbar autocomplete="off">`);
    const $searchWrapper = $(`<div class="hct-search-wrapper">`);
    this.$input = $(`<input type="text" placeholder="${game.i18n.localize('HCT.Common.Searchbar.Placeholder')}">`);
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
    $form.on('submit', (e) => false);
    $parent.append($form);
  }

  private setSuggestionsInteraction($searchWrapper: JQuery<HTMLElement>) {
    $('div', this.$resultBox).on('click', (event) => {
      const key = $(event.currentTarget).data('key');
      $searchWrapper.removeClass('active');
      this.$input.val(this.options.find((o) => o.key == key)?.name ?? 'INVALID_KEY');
      this.selectCallback(key);
    });
  }

  value(): any {
    return null;
  }

  showSuggestions(searchArray: Result[]) {
    let listData;
    if (!searchArray.length) {
      listData = `<li>${'No matches'}</li>`;
    } else {
      listData = searchArray
        .map(
          (result) =>
            `<li><div class="hct-icon-with-context" data-key=\"${
              result.key
            }\"><img class="hct-icon-square-med hct-background-black hct-no-border" src="${
              result.img ?? Constants.MYSTERY_MAN
            }"><span>${result.name}</span></div></li>`,
        )
        .join('');
    }
    this.$resultBox.html(listData);
  }
}

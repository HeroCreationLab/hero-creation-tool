import * as Constants from '../constants';
import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';
import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';
import { IndexEntry } from '../indexUtils';

export default class SelectOrCustomItemOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly data: {
      type: string;
      source?: string;
    },
    readonly propertiesCallback: () => any,
    readonly selectOptions?: IndexEntry[],
    readonly settings: {
      allowNulls?: boolean;
      addValues: boolean;
    } = { addValues: true },
  ) {}

  readonly key: string = 'items';
  readonly CUSTOM = 'custom';

  private $select!: JQuery;
  private $link!: JQuery;
  private $icon!: JQuery;
  private $customInputs!: JQuery;
  private $customName!: JQuery;
  private $customDescription!: JQuery;

  private isCustom = false;
  private item: IndexEntry | undefined;

  isFulfilled() {
    return !!this.$customName.val() && !!this.$customDescription.val();
  }

  async applyToHero(actor: ActorDataConstructorData) {
    if (this.$select.val()) {
      const itemToAdd = this.item ? this.item : await this.buildItem();
      apply(actor, this.key, [itemToAdd], this.settings.addValues);
    }
  }

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} parent
   */
  render(parent: JQuery): void {
    const $container = $('<div>');
    const $iconAndSelect = $(`<div class="hct-icon-with-context hct-margin-b-tiny">`);

    this.$link = $(`<a class="hct-icon-link" draggable="false" data-pack="" data-id="">`);
    this.$icon = $(`<img class="hct-icon hct-icon-clickable" src="${Constants.MYSTERY_MAN}">`);
    this.$icon.on('click', () => {
      if (this.isCustom) this.openFilePicker();
    });
    this.$link.append(this.$icon);
    $iconAndSelect.append(this.$link);

    this.$select = $(`<select class="hct-option-select hct-margin-l-tiny">`)
      .append(
        $(`<option value="" selected ${this.settings.allowNulls ? '' : 'hidden disabled'}>
      ${game.i18n.localize('HCT.Common.SelectPlaceholder')}
      </option>`),
      )
      .append(
        $(`<option value="${this.CUSTOM}">
      ${game.i18n.localize('HCT.Common.SelectCreateOne')}
      </option>`),
      );
    if (this.selectOptions) {
      this.$select.append(
        this.selectOptions.map((option: IndexEntry, index: number) =>
          $(`<option value="${index}">${option.name}</option>`),
        ),
      );
    }
    this.$select.on('change', () => {
      this.isCustom = this.CUSTOM === this.$select.val();
      if (this.isCustom) {
        this.$link.removeClass('content-link');
        this.$customDescription.text('');
        this.$customName.text('');
        this.item = undefined;
        this.$icon.attr('src', Constants.MYSTERY_MAN);
        this.$customInputs.show();
      } else {
        this.$customInputs.hide();
        const index = parseInt(this.$select.val() as string);
        this.item = this.selectOptions![index];
        this.$icon.attr('src', this.item.img || Constants.MYSTERY_MAN);
        this.$link.attr('data-pack', this.item._pack);
        this.$link.attr('data-id', this.item._id);
        this.$link.addClass('content-link');
      }
    });
    $iconAndSelect.append(this.$select);
    $container.append($iconAndSelect);

    this.$customInputs = $('<div data-hct_custom_item_inputs>');
    const $nameDiv = $("<div class='hct-margin-b-tiny'>");
    this.$customName = $(`<input type="text" placeholder="${game.i18n.localize('HCT.Common.RequiredName')}">`);
    $nameDiv.append(this.$customName);
    this.$customDescription = $(`<textarea type="text" placeholder="${game.i18n.localize('HCT.Common.Desc')}">`);
    this.$customInputs.append($nameDiv);
    this.$customInputs.append(this.$customDescription);
    this.$customInputs.hide(); // hide by default
    $container.append(this.$customInputs);

    parent.append($container);
  }

  /**
   * Unused for CustomItemOption
   */
  value(): void {
    return;
  }

  async buildItem() {
    // fetch name, description and icon and create an item to return
    let itemDataConstructorData: ItemDataConstructorData;
    const callbackProperties = this.propertiesCallback();
    if (!this.$customName.val()) {
      ui.notifications?.error(game.i18n.format('HCT.Error.CustomItemWithoutName', { origin: this.origin }));
      throw new Error('Trying to create feature without name');
    }

    try {
      const featureName = this.$customName.val() as string;
      const featureDesc = this.$customDescription.val() as string;
      const featureIcon = this.$icon.attr('src') as string;
      if (!featureName || !featureName.trim()) {
        if (featureDesc || (featureIcon && featureIcon !== Constants.MYSTERY_MAN)) {
          ui.notifications?.error(game.i18n.format('HCT.Error.CustomItemWithoutName', { origin: this.origin }));
          return;
        }
      }
      itemDataConstructorData = {
        name: featureName,
        type: this.data.type,
        img: featureIcon,
        data: {
          description: {
            value: featureDesc,
          },
          requirements: callbackProperties.requirements || '',
          source: this.data.source || '',
        },
      };
      const item = await Item.create(itemDataConstructorData /*, { temporary: true }*/);
      return { ...item?.toObject(), custom: true };
    } catch (error) {
      console.warn('Error trying to create custom item');
      console.error(error);
      console.warn(`name.val: [${this.$customName.val()}]`);
      console.warn(`desc.val: [${this.$customDescription.val()}]`);
      console.warn('itemData: ');
      console.warn(itemDataConstructorData!);
    }
  }

  openFilePicker() {
    const path1 = '/';
    const fp2 = new FilePicker({
      type: 'image',
      current: path1,
      callback: (path: string) => {
        this.$icon.attr('src', path);
      },
    } as any);
    fp2.browse();
  }
}

import { StepEnum } from '../step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './heroOption';
import { EquipmentEntry } from '../indexes/indexUtils';
import { Price, normalizePriceInGp } from '../utils';

/**
 * Represents a value with a selectable quantity that will be imprinted into the created actor
 * @class
 */
export default class QuantifiableOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    private itemOption: EquipmentEntry,
    readonly settings: {
      addValues: boolean;
      quantity: number;
      canChangeQuantity: boolean;
      showTotalCost: boolean;
      price?: Price;
      id?: string;
      changeCallback?: (id: string, newQuantity: Price) => any;
    } = { addValues: true, quantity: 1, canChangeQuantity: false, showTotalCost: false },
  ) {}
  key = 'items';

  isFulfilled() {
    return !!this.itemOption;
  }

  applyToHero(actor: ActorDataConstructorData) {
    this.itemOption.system.quantity = this.settings.quantity;
    apply(actor, this.key, [this.itemOption], this.settings.addValues, false);
  }

  private $up = $(
    `<button id='hct_quantity_button_up' class="hct-button--floating"><i class="hct-m-0 fas fa-angle-up" class="hct-p-sm"></i></button>`,
  );
  private $down = $(
    `<button id='hct_quantity_button_down' class="hct-button--floating"><i class="hct-m-0 fas fa-angle-down" class="hct-p-sm"></i></button>`,
  );
  private $text = $(buildText(this.itemOption, this.settings.quantity, this.settings.showTotalCost));

  render(parent: JQuery): void {
    const $container = $('<div class="hct-icon-with-context hct-pb-sm hct-grow">');
    const $link = this.itemOption.local
      ? $(
          `<a class="content-link hct-icon-link" draggable="false" data-type="Item" data-entity="Item" data-uuid="${this.itemOption._uuid}">`,
        )
      : $(`<a class="content-link hct-icon-link flexrow" draggable="false" data-uuid="${this.itemOption._uuid}">`);
    const $itemImg = $('<img class="hct-icon hct-border-0 hct-border-rad-tiny hct-hover-shadow-accent">').attr(
      'src',
      this.itemOption.img,
    );
    $link.append($itemImg);
    $container.append($link);
    $container.append(this.$text);

    if (this.settings.canChangeQuantity) {
      const $buttons = $(`<div class='hct-quantity-buttons'>`);
      $buttons.append(this.$up);
      $buttons.append(this.$down);
      $container.append($buttons);

      this.$up.on('click', (ev) => {
        if (ev.ctrlKey) {
          this.settings.quantity += 5;
        } else {
          this.settings.quantity++;
        }
        const priceInGp = normalizePriceInGp({
          value: this.settings.quantity * this.settings.price!.value,
          denomination: this.settings.price!.denomination,
        });
        this.settings.changeCallback!(this.settings.id!, priceInGp);
        this.$text.html(buildText(this.itemOption, this.settings.quantity, this.settings.showTotalCost));
      });
      this.$down.on('click', (ev) => {
        if (this.settings.quantity > 1) {
          if (ev.ctrlKey) {
            this.settings.quantity > 6 ? (this.settings.quantity -= 5) : (this.settings.quantity = 1);
          } else {
            this.settings.quantity--;
          }
          const priceInGp = normalizePriceInGp({
            value: this.settings.quantity * this.settings.price!.value,
            denomination: this.settings.price!.denomination,
          });
          this.settings.changeCallback!(this.settings.id!, priceInGp);
          this.$text.html(buildText(this.itemOption, this.settings.quantity, this.settings.showTotalCost));
        }
      });
    }

    parent.append($container);
  }

  /**
   * @returns the current value of this option
   */
  value(): any {
    return this.itemOption;
  }
}

function buildText(itemOption: any, quantity: number, showTotal: boolean) {
  if (showTotal) {
    const totalPrice = Math.round((itemOption.system.price.value * quantity + Number.EPSILON) * 100) / 100;
    const normalizedPrice = normalizePriceInGp({
      value: totalPrice,
      denomination: itemOption.system.price.denomination,
    });
    return `<p class="hct-grow">${itemOption.name} x${quantity} (${normalizedPrice.value}${normalizedPrice.denomination})</p>`;
  } else {
    return `<p class="hct-grow">${itemOption.name} x${quantity}</p>`;
  }
}

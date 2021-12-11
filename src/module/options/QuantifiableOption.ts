import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';
import { EquipmentEntry } from '../indexUtils';

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
      price?: number;
      id?: string;
      changeCallback?: (id: string, newQuantity: number) => any;
    } = { addValues: true, quantity: 1, canChangeQuantity: false, showTotalCost: false },
  ) {}
  key = 'items';

  isFulfilled() {
    return !!this.itemOption;
  }

  applyToHero(actor: ActorDataConstructorData) {
    this.itemOption.data.quantity = this.settings.quantity;
    apply(actor, this.key, [this.itemOption], this.settings.addValues, false);
  }

  private $up = $(
    `<button class="hct-button--floating hct-button-up"><i class="hct-margin-0 fas fa-angle-up" class="hct-padding-tiny"></i></button>`,
  );
  private $down = $(
    '<button class="hct-button--floating hct-button-down"><i class="hct-margin-0 fas fa-angle-down" class="hct-padding-tiny"></i></button>',
  );
  private $text = $(buildText(this.itemOption, this.settings.quantity, this.settings.showTotalCost));

  render(parent: JQuery): void {
    const $container = $('<div class="hct-icon-with-context hct-padding-b-tiny hct-flex-grow-1">');
    const $link = $(
      `<a class="content-link hct-icon-link hct-flex" draggable="false" data-pack="${this.itemOption._pack}" data-id="${this.itemOption._id}">`,
    );
    const $itemImg = $('<img class="hct-icon hct-hover-shadow-accent">').attr('src', this.itemOption.img);
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
        this.settings.changeCallback!(this.settings.id!, this.settings.quantity * this.settings.price!);
        this.$text.html(buildText(this.itemOption, this.settings.quantity, this.settings.showTotalCost));
      });
      this.$down.on('click', (ev) => {
        if (this.settings.quantity > 1) {
          if (ev.ctrlKey) {
            this.settings.quantity > 6 ? (this.settings.quantity -= 5) : (this.settings.quantity = 1);
          } else {
            this.settings.quantity--;
          }
          this.settings.changeCallback!(this.settings.id!, this.settings.quantity * this.settings.price!);
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
    const totalPrice = Math.round((itemOption.data.price * quantity + Number.EPSILON) * 100) / 100;
    return `<p class="hct-flex-grow-1">${itemOption.name} x${quantity} (${totalPrice}gp)</p>`;
  } else {
    return `<p class="hct-flex-grow-1">${itemOption.name} x${quantity}</p>`;
  }
}

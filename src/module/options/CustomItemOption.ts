import { StepEnum } from '../Step';
import { ActorDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/actorData';
import HeroOption, { apply } from './HeroOption';
import { ItemDataConstructorData } from '@league-of-foundry-developers/foundry-vtt-types/src/foundry/common/data/data.mjs/itemData';

/**
 * Represents a fixed value that will be imprinted into the created actor
 * (e.g. how all Elves get Perception proficiency)
 * @class
 */
export default class CustomItemOption implements HeroOption {
  constructor(
    readonly origin: StepEnum,
    readonly data: {
      type: string;
      source?: string;
    },
  ) {}

  readonly key: string = 'items';
  readonly settings: { addValues: boolean } = { addValues: true };

  private $name!: JQuery;
  private $description!: JQuery;
  private $icon!: JQuery;

  isFulfilled() {
    return !!this.$name.val() && !!this.$description.val();
  }

  async applyToHero(actor: ActorDataConstructorData) {
    // create feature, then reference item
    let itemDataConstructorData: ItemDataConstructorData;
    try {
      const featureName = this.$name.val() as string;
      const featureDesc = this.$description.val() as string;
      const featureIcon = this.$icon.attr('src') as string;
      itemDataConstructorData = {
        name: featureName,
        type: this.data.type,
        img: featureIcon,
        data: {
          description: {
            value: featureDesc,
          },
          source: this.data.source || '',
        },
      };
      const item = await Item.create({ ...itemDataConstructorData });

      apply(actor, this.key, [item], this.settings.addValues);
    } catch (error) {
      console.warn('Error trying to create custom item');
      console.error(error);
      console.warn(`name.val: [${this.$name.val()}]`);
      console.warn(`desc.val: [${this.$description.val()}]`);
      console.warn('itemData: ');
      console.warn(itemDataConstructorData!);
    }
  }

  /**
   * Builds the HTML element for this option and appends it to the parent
   * @param {JQuery} parent
   */
  render(parent: JQuery): void {
    const $container = $('<div>');

    this.$icon = $(`<img class="hct-icon hct-icon-clickable" src="icons/svg/mystery-man.svg">`);
    this.$icon.on('click', () => this.openFilePicker());
    this.$name = $(`<input type="text" placeholder="${game.i18n.localize('HCT.Common.FeatureName')}">`);
    this.$description = $(`<textarea type="text" placeholder="${game.i18n.localize('DND5E.Description')}">`);
    const $iconTitle = $(`<div class="hct-selector-with-icon">`);
    $iconTitle.append(this.$icon);
    $iconTitle.append(this.$name);
    $container.append($iconTitle);
    $container.append($(`<div class="hct-option">`).append(this.$description));

    parent.append($container);
  }

  /**
   * Unused for CustomItemOption
   */
  value(): any {
    return undefined;
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

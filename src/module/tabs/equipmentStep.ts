import * as Utils from '../utils';
import * as Constants from '../constants';
import { Step, StepEnum } from '../Step';
import FixedOption, { OptionType } from '../options/FixedOption';
import SettingKeys from '../settings';
import HeroOption from '../options/HeroOption';
import OptionContainer from '../options/OptionContainer';
import DeletableOption from '../options/DeletableOption';
import { EquipmentEntry, getEquipmentEntries, getRuleJournalEntryByName } from '../indexUtils';

type itemOrPack = {
  itemName?: string;
  item?: EquipmentEntry;
};

class _Equipment extends Step {
  constructor() {
    super(StepEnum.Equipment);
  }

  defaultGoldDice!: string;
  $rollInput!: JQuery;
  $manualGold!: JQuery;
  $totalGold!: JQuery;
  $remainingGold!: JQuery;
  $extraGold!: JQuery;

  section = () => $('#eqDiv');

  $searchWrapper!: JQuery;
  $inputBox!: JQuery;
  $suggBox!: JQuery;
  $itemList!: JQuery;
  searchArray: EquipmentEntry[] = [];

  items!: EquipmentEntry[];
  searchableList!: EquipmentEntry[];

  available = 0;
  total = 0;
  extra = 0;
  spent = 0;

  priceMap: Map<string, number> = new Map();

  async setListeners() {
    this.$searchWrapper = $('.hct-search-wrapper', this.section());
    this.$inputBox = $('input', this.$searchWrapper);
    this.$suggBox = $('[data-hct-searchbar-results]', this.$searchWrapper);
    this.$itemList = $('[data-hct-itemlist]', this.section());
    this.$manualGold = $('[data-hct_equipment_manual_gold]', this.section());
    this.$extraGold = $('[data-hct_equipment_extra]', this.section());

    $('[data-hct-searchbar]', this.section()).on('submit', (event) => {
      if (this.searchArray.length == 1) {
        try {
          this.addItemOrPack({ item: this.searchArray[0] });
          this.$inputBox.val('');
        } catch (error) {
          console.error(error);
          return false;
        }
      }
      return false;
    });

    $('[data-hct_equipment_roll]', this.section()).on('click', async (e) => {
      const rollExpression = this.$rollInput.val() as string;
      const roll = await new Roll(rollExpression).evaluate({ async: true });
      if (Utils.getModuleSetting(SettingKeys.SHOW_ROLLS_AS_MESSAGES)) {
        roll.toMessage({ flavor: game.i18n.localize('HCT.Equipment.RollChatFlavor') });
      }
      this.available = roll.total ?? 0;

      this.$manualGold.prop('disabled', true).val('');
      this.updateGold();
    });

    $('[data-hct_equipment_input]', this.section()).on('click', (e) => {
      this.$manualGold.prop('disabled', false).val(0);
      this.available = 0;
      this.updateGold();
    });

    this.$manualGold.on('keyup', (e) => {
      this.available = parseInt(this.$manualGold.val() as string) || 0;
      this.updateGold();
    });

    this.$extraGold.on('keyup', (e) => {
      this.extra = parseInt(this.$extraGold.val() as string) || 0;
      this.updateGold();
    });

    $('[data-hct_equipment_clear]', this.section()).on('click', () => {
      this.clearOptions();
      this.$itemList.empty();
      this.spent = 0;
      this.updateGold();
    });

    this.$inputBox.on('keyup', (e) => {
      const userData = (e.target as any).value;
      if (userData) {
        this.searchArray = this.searchableList.filter((data) => {
          return data.name.toLocaleLowerCase().includes(userData.toLocaleLowerCase());
        });
        this.$searchWrapper.addClass('active');
        this.showSuggestions(this.searchArray);
        $('div', this.$suggBox).on('click', (event) => {
          this.select($(event.currentTarget).data('item_name'));
        });
      } else {
        this.$searchWrapper.removeClass('active');
      }
    });
  }

  select(itemName: string) {
    this.addItemOrPack({ itemName: itemName });
    this.$inputBox.val('');
    this.$searchWrapper.removeClass('active');
  }

  private addItemOrPack(itemOrPack: itemOrPack) {
    const item = itemOrPack.item ?? this.searchableList.find((i) => i.name == itemOrPack.itemName);
    if (!item) {
      console.error(itemOrPack);
      throw new Error(`Item for item/pack not found`);
    }
    if (isPack(item)) {
      this.addPackToSelection(item.name as PackNames);
    } else {
      const id = foundry.utils.randomID();
      this.addItemOptionToSelection(id, this.makeItemOption(id, item, 1), item.data.price, 1);
    }
  }

  showSuggestions(list: EquipmentEntry[]) {
    let listData;
    if (!list.length) {
      listData = `<li>${'No matches'}</li>`;
    } else {
      listData = list
        .map(
          (item) =>
            `<li><div class="hct-icon-with-context" data-item_name=\"${item.name}\"><img class="hct-icon-square-med hct-background-black hct-no-border" src="${item.img}"><span>${item.name} (${item.data.price}gp)</span></div></li>`,
        )
        .join('');
    }
    this.$suggBox.html(listData);
  }

  addPackToSelection(packName: PackNames) {
    const options = [];
    const id = foundry.utils.randomID();
    switch (packName) {
      case PackNames.BURGLAR:
        this.items
          .filter((item) => {
            const itemsInPack = [
              'Backpack',
              'Ball Bearings',
              'Bell',
              'Crowbar',
              'Hammer',
              'Hooded Lantern',
              'Tinderbox',
              'Waterskin',
              'Hempen Rope (50 ft.)',
            ];
            return itemsInPack.includes(item.name!);
          })
          .forEach((item) => options.push(this.makeItemOption('', item, 1, false)));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Candle')!, 5, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Piton')!, 10, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Oil Flask')!, 2, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Rations')!, 5, false));

        this.addItemOptionToSelection(
          id,
          new OptionContainer(
            StepEnum.Equipment,
            'items',
            options,
            PackNames.BURGLAR,
            { addValues: true, deletable: true },
            (opt: DeletableOption) => this.onDelete(opt),
            id,
          ),
          PackPrices.BURGLAR,
          1,
        );
        break;

      case PackNames.DIPLOMAT:
        this.items
          .filter((item) => {
            const itemsInPack = [
              'Chest',
              'Fine Clothes',
              'Ink Bottle',
              'Ink Pen',
              'Lamp',
              'Perfume',
              'Sealing Wax',
              'Soap',
            ];
            return itemsInPack.includes(item.name!);
          })
          .forEach((item) => options.push(this.makeItemOption('', item, 1, false)));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Map or Scroll Case')!, 2, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Oil Flask')!, 2, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Paper')!, 5, false));

        this.addItemOptionToSelection(
          id,
          new OptionContainer(
            StepEnum.Equipment,
            'items',
            options,
            PackNames.DIPLOMAT,
            { addValues: true, deletable: true },
            (opt: DeletableOption) => this.onDelete(opt),
            foundry.utils.randomID(),
          ),
          PackPrices.DIPLOMAT,
          1,
        );
        break;

      case PackNames.DUNGEONEER:
        this.items
          .filter((item) => {
            const itemsInPack = ['Backpack', 'Crowbar', 'Hammer', 'Tinderbox', 'Waterskin', 'Hempen Rope (50 ft.)'];
            return itemsInPack.includes(item.name!);
          })
          .forEach((item) => options.push(this.makeItemOption('', item, 1, false)));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Piton')!, 10, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Torch')!, 10, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Rations')!, 10, false));
        this.addItemOptionToSelection(
          id,
          new OptionContainer(
            StepEnum.Equipment,
            'items',
            options,
            PackNames.DUNGEONEER,
            { addValues: true, deletable: true },
            (opt: DeletableOption) => this.onDelete(opt),
            foundry.utils.randomID(),
          ),
          PackPrices.DUNGEONEER,
          1,
        );
        break;

      case PackNames.ENTERNAINER:
        this.items
          .filter((item) => {
            const itemsInPack = ['Backpack', 'Bedroll', 'Waterskin', 'Disguise Kit'];
            return itemsInPack.includes(item.name!);
          })
          .forEach((item) => options.push(this.makeItemOption('', item, 1, false)));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Costume Clothes')!, 2, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Candle')!, 5, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Rations')!, 5, false));
        this.addItemOptionToSelection(
          id,
          new OptionContainer(
            StepEnum.Equipment,
            'items',
            options,
            PackNames.ENTERNAINER,
            { addValues: true, deletable: true },
            (opt: DeletableOption) => this.onDelete(opt),
            foundry.utils.randomID(),
          ),
          PackPrices.ENTERNAINER,
          1,
        );
        break;

      case PackNames.EXPLORER:
        this.items
          .filter((item) => {
            const itemsInPack = ['Backpack', 'Bedroll', 'Mess Kit', 'Tinderbox', 'Waterskin', 'Hempen Rope (50 ft.)'];
            return itemsInPack.includes(item.name!);
          })
          .forEach((item) => options.push(this.makeItemOption('', item, 1, false)));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Torch')!, 10, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Rations')!, 10, false));
        this.addItemOptionToSelection(
          id,
          new OptionContainer(
            StepEnum.Equipment,
            'items',
            options,
            PackNames.EXPLORER,
            { addValues: true, deletable: true },
            (opt: DeletableOption) => this.onDelete(opt),
            foundry.utils.randomID(),
          ),
          PackPrices.EXPLORER,
          1,
        );
        break;

      case PackNames.PRIEST:
        this.items
          .filter((item) => {
            const itemsInPack = ['Backpack', 'Blanket', 'Tinderbox', 'Alms Box', 'Censer', 'Vestments', 'Waterskin'];
            return itemsInPack.includes(item.name!);
          })
          .forEach((item) => options.push(this.makeItemOption('', item, 1, false)));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Candle')!, 10, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Block of Incense')!, 2, false));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Rations')!, 2, false));
        this.addItemOptionToSelection(
          id,
          new OptionContainer(
            StepEnum.Equipment,
            'items',
            options,
            PackNames.PRIEST,
            { addValues: true, deletable: true },
            (opt: DeletableOption) => this.onDelete(opt),
            foundry.utils.randomID(),
          ),
          PackPrices.PRIEST,
          1,
        );
        break;

      case PackNames.SCHOLAR:
        this.items
          .filter((item) => {
            const itemsInPack = ['Backpack', 'Book of Lore', 'Ink Bottle', 'Ink Pen', 'Bag of Sand', 'Small Knife'];
            return itemsInPack.includes(item.name!);
          })
          .forEach((item) => options.push(this.makeItemOption('', item, 1, false)));
        options.push(this.makeItemOption('', this.items.find((i) => i.name == 'Parchment')!, 10, false));
        this.addItemOptionToSelection(
          id,
          new OptionContainer(
            StepEnum.Equipment,
            'items',
            options,
            PackNames.SCHOLAR,
            { addValues: true, deletable: true },
            (opt: DeletableOption) => this.onDelete(opt),
            foundry.utils.randomID(),
          ),
          PackPrices.SCHOLAR,
          1,
        );
        break;
    }
  }

  onDelete(option: DeletableOption) {
    this.stepOptions.splice(this.stepOptions.indexOf(option), 1);
    const deletableId = option.callbackParams;
    $(`#hct_deletable_${deletableId}`, this.$itemList).remove();

    const price = this.priceMap.get(deletableId);
    this.priceMap.delete(deletableId);
    this.updateGold(-price!);
  }

  makeItemOption(id: string, item: EquipmentEntry, quantity = 1, deletable = true): HeroOption {
    const option = new FixedOption(
      StepEnum.Equipment,
      'items',
      item,
      `${item.name} x${quantity} (${item.data.price * quantity}gp)`,
      {
        addValues: true,
        type: OptionType.ITEM,
        quantity: quantity ?? 1,
      },
    );
    if (deletable) {
      return new DeletableOption(
        StepEnum.Equipment,
        option,
        { addValues: true },
        (args?: any) => this.onDelete(args),
        id,
        true,
      );
    } else {
      return option;
    }
  }

  addItemOptionToSelection(id: string, itemOption: HeroOption, cost: number, quantity = 1) {
    this.priceMap.set(id, cost * quantity);
    itemOption.render(this.$itemList);
    this.stepOptions.push(itemOption);
    this.updateGold(cost * quantity);
  }

  updateGold(reduceBy?: number) {
    if (reduceBy) this.spent += reduceBy;
    this.total = this.roundToTwo(this.available) + this.roundToTwo(this.extra);
    this.$totalGold.html(this.total.toString());
    this.$remainingGold.html(this.roundToTwo(this.total - this.spent).toString());
  }

  roundToTwo(num: number) {
    return Math.round(num * 100 + Number.EPSILON) / 100;
  }

  async setSourceData() {
    const filteredItems = await getEquipmentEntries();
    this.items = filteredItems
      .filter((item) => item?.data?.rarity == 'common') // get only common items
      .filter((item) => !itemBlackList.includes(item.name)); // remove some punctual "common" but magical/special items

    this.defaultGoldDice = game.settings.get(Constants.MODULE_NAME, SettingKeys.DEFAULT_GOLD_DICE) as string;
  }

  async renderData() {
    Utils.setPanelScrolls(this.section());
    // Show rules on the side panel
    const rulesCompendiumName = game.i18n.localize('HCT.Equipment.RulesJournalName');
    const equipmentRules = await getRuleJournalEntryByName(rulesCompendiumName);
    if (equipmentRules) {
      $('[data-hct_equipment_description]', this.section()).html(TextEditor.enrichHTML(equipmentRules.content));
    } else {
      console.error(`Unable to find equipment's rule journal on compendium ${rulesCompendiumName}`);
    }

    this.searchableList = [...packs, ...this.items.filter((data) => data.name)];
    this.$rollInput = $('[data-hct_equipment_roll_expression]', this.section()).val(this.defaultGoldDice);
    this.$totalGold = $('[data-hct_total_gold]', this.section());
    this.$remainingGold = $('[data-hct_remaining_gold]', this.section());
    this.available = 0;
    this.total = 0;
    this.extra = 0;
    this.spent = 0;
  }

  getOptions() {
    // add remaining gold
    const remaining = parseFloat(this.$remainingGold.html()) || 0;
    const $addRemainingCheckbox = $('#hct-remaining-gold', this.section());
    if ($addRemainingCheckbox.is(':checked') && remaining && remaining > 0) {
      this.stepOptions.push(
        new FixedOption(StepEnum.Equipment, 'data.currency', {
          cp: Math.floor((remaining * 100) % 10),
          sp: Math.floor((remaining * 10) % 10),
          gp: Math.floor(remaining),
        }),
      );
    }
    return this.stepOptions;
  }
}
const EquipmentTab: Step = new _Equipment();
export default EquipmentTab;

function isPack(item: EquipmentEntry): boolean {
  return packs.includes(item);
}

const enum PackNames {
  BURGLAR = "Burglar's Pack",
  DIPLOMAT = "Diplomat's Pack",
  DUNGEONEER = "Dungeoneer's Pack",
  ENTERNAINER = "Entertainer's Pack",
  EXPLORER = "Explorer's Pack",
  PRIEST = "Priest's Pack",
  SCHOLAR = "Scholar's Pack",
}

const PackPrices = {
  BURGLAR: 16,
  DIPLOMAT: 39,
  DUNGEONEER: 12,
  ENTERNAINER: 40,
  EXPLORER: 10,
  PRIEST: 19,
  SCHOLAR: 40,
};
const packs: EquipmentEntry[] = [
  {
    name: PackNames.BURGLAR,
    data: { price: PackPrices.BURGLAR, rarity: '' },
    img: 'icons/tools/hand/lockpicks-steel-grey.webp',
    _id: '',
    _pack: '',
    type: '',
  },
  {
    name: PackNames.DIPLOMAT,
    data: { price: PackPrices.DIPLOMAT, rarity: '' },
    img: 'icons/commodities/treasure/medal-ribbon-gold-red.webp',
    _id: '',
    _pack: '',
    type: '',
  },
  {
    name: PackNames.DUNGEONEER,
    data: { price: PackPrices.DUNGEONEER, rarity: '' },
    img: 'icons/sundries/lights/torch-brown-lit.webp',
    _id: '',
    _pack: '',
    type: '',
  },
  {
    name: PackNames.ENTERNAINER,
    data: { price: PackPrices.ENTERNAINER, rarity: '' },
    img: 'icons/tools/instruments/lute-gold-brown.webp',
    _id: '',
    _pack: '',
    type: '',
  },
  {
    name: PackNames.EXPLORER,
    data: { price: PackPrices.EXPLORER, rarity: '' },
    img: 'icons/tools/navigation/map-marked-green.webp',
    _id: '',
    _pack: '',
    type: '',
  },
  {
    name: PackNames.PRIEST,
    data: { price: PackPrices.PRIEST, rarity: '' },
    img: 'icons/commodities/treasure/token-gold-cross.webp',
    _id: '',
    _pack: '',
    type: '',
  },
  {
    name: PackNames.SCHOLAR,
    data: { price: PackPrices.SCHOLAR, rarity: '' },
    img: 'icons/skills/trades/academics-merchant-scribe.webp',
    _id: '',
    _pack: '',
    type: '',
  },
];

// TODO send this list to a module setting
const itemBlackList = [
  'Potion of Climbing',
  'Potion of Healing',
  'Spell Scroll 1st Level',
  'Spell Scroll Cantrip Level',
  'Unarmed Strike',
];

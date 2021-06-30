/*
  Functions used exclusively on the Class tab
*/
import { Step, StepEnum } from '../Step';
import * as Constants from '../constants';
import * as Utils from '../utils';
import { Settings } from '../settings';
import { HeroOption, FixedHeroOption, HiddenHeroOption } from '../HeroOption';

type Clazz = {
  img: string;
  name: string;
};

class _Class extends Step {
  classes?: Item[] = [];
  clazz!: Clazz;
  constructor() {
    super(StepEnum.Class);
  }
  $context!: JQuery;

  section = () => $('#classDiv');

  setListeners(): void {
    $('[data-hct_class_picker]', this.section()).on('change', async (event) => {
      this.clearOptions();
      const className: string = $(event.currentTarget).val() as string;
      this.clazz = this.classes!.filter((c) => c.name === className)[0] as any;
      if (this.classes) {
        const options = updateClass(this.clazz, this.section());
        this.stepOptions.push(...options);
      } else ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Classes' }));
    });
  }

  async setSourceData() {
    const items: Item[] = await Utils.getItemListFromCompendiumByName(Constants.DND5E_COMPENDIUMS.CLASSES);
    console.log(items);
    const customPack = await game.settings.get(Constants.MODULE_NAME, Settings.CLASS_PACKS);
    if (customPack) {
      const customClasses = await Utils.getItemListFromCompendiumByName(customPack);
      items.push(...customClasses);
    }
    console.log(`setting source data with items ${items}`);
    this.classes = items?.sort((a, b) => a.name.localeCompare(b.name));
    if (this.classes) setClassPickerOptions(this.classes);
    else ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Classes' }));
  }

  renderData(): void {
    $('[data-hct_class_data]', this.section()).hide();
  }
}
const ClassTab: Step = new _Class();
export default ClassTab;

function setClassPickerOptions(classes: Item<Item.Data<any>, Item.Data<any>>[]) {
  const picker = $('[data-hct_class_picker]');
  for (const clazz of classes) {
    picker.append($(`<option class='hct_picker_primary' value='${clazz.name}'>${clazz.name}</option>`));
    // if (!clazz.parentRace) {
    //   // race is a primary race
    //   const subclasses = races.filter((r: Race) => r.parentRace == clazz);
    //   if (subclasses.length) {
    //     // race has classes - make an optgroup
    //     picker.append(
    //       $(`<optgroup class='hct_picker_primary hct_picker_primary_group' label='${clazz.name}'></optgroup>`),
    //     );
    //   } else {
    //     // race is standalone - make an option
    //     picker.append($(`<option class='hct_picker_primary' value='${clazz.name}'>${clazz.name}</option>`));
    //   }
    // } else {
    //   // race is a subclass - find the parent and append to its optgroup
    //   $(`[label=${clazz.parentRace.name}]`, picker).append(
    //     $(`<option class='hct_picker_secondary' value='${clazz.name}'>${clazz.name}</option>`),
    //   );
    // }
  }
}

function updateClass(classItem: any, $section: JQuery): HeroOption[] {
  const $context = $('[data-hct_class_data]', $section);
  const options: HeroOption[] = [];
  console.log(classItem);

  // icon and class item
  $('[data-hct_class_icon]', $section).attr('src', classItem.img);
  options.push(new HiddenHeroOption(ClassTab.step, 'items', [classItem], true));

  // hit points
  const $hitPointSection = $('section', $('[data-hct_class_area=hit-points]', $context)).empty();
  const hitDice = new HitDice(classItem.data.hitDice);
  const textBlob = game.i18n.format('HCT.Class.HitPointsBlob', {
    value: hitDice.getVal(),
    max: hitDice.getMax(),
    average: hitDice.getAvg(),
    className: classItem.name,
  });
  const hitPointsOption = new FixedHeroOption(ClassTab.step, 'key', hitDice.getMax(), textBlob);
  hitPointsOption.render($hitPointSection);
  options.push(hitPointsOption);

  // proficiencies

  // saving throws

  $('[data-hct_class_data]').show();
  return options;
}

class HitDice {
  constructor(private hd: string) {}

  getVal() {
    return `1${this.hd}`;
  }

  getMax() {
    return this.hd.substring(1);
  }

  getAvg() {
    const half = Math.ceil(Number.parseInt(this.getMax()) / 2);
    return half + 1;
  }
}

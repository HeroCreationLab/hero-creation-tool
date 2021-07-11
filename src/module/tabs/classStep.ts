/*
  Functions used exclusively on the Class tab
*/
import { Step, StepEnum } from '../Step';
import * as Constants from '../constants';
import * as Utils from '../utils';
import Settings from '../settings';
import HiddenOption from '../options/HiddenOption';
import MultiOption from '../options/MultiOption';
import FixedOption, { OptionType } from '../options/FixedOption';
import OptionsContainer from '../options/OptionsContainer';
import HeroOption from '../options/HeroOption';

type Clazz = {
  img: string;
  name: string;
};

class _Class extends Step {
  classes?: Item[] = [];
  classFeatures?: Item[] = [];
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
        const options = this.updateClass(this.clazz, this.section());
        this.stepOptions.push(...options);
      } else ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Classes' }));
    });
  }

  async setSourceData() {
    // classes
    const classItems = await Utils.getSources({
      baseSource: Constants.DEFAULT_PACKS.CLASSES,
      customSourcesProperty: Settings.CLASS_PACKS,
    });
    this.classes = classItems?.sort((a, b) => a.name.localeCompare(b.name)) as any;
    if (this.classes) setClassPickerOptions(this.classes);
    else ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Classes' }));

    // class features
    const classFeatureItems = await Utils.getSources({
      baseSource: Constants.DEFAULT_PACKS.CLASS_FEATURES,
      customSourcesProperty: Settings.CLASS_FEATURE_PACKS,
    });
    this.classFeatures = classFeatureItems?.sort((a, b) => a.name.localeCompare(b.name)) as any;
  }

  renderData(): void {
    $('[data-hct_class_data]', this.section()).hide();
  }

  updateClass(classItem: any, $section: JQuery): HeroOption[] {
    const $context = $('[data-hct_class_data]', $section);
    const options: HeroOption[] = [];
    console.log(classItem);

    // icon, description and class item
    $('[data-hct_class_icon]', $section).attr('src', classItem.img);
    $('[data-hct_class_description]', $section).html(TextEditor.enrichHTML(classItem.data.description.value));
    options.push(new HiddenOption(ClassTab.step, 'items', [classItem], { addValues: true }));

    // hit points
    const hitDice = new HitDice(classItem.data.hitDice);
    const textBlob = game.i18n.format('HCT.Class.HitPointsBlob', {
      max: hitDice.getMax(),
    });
    const hitPointsOption = new FixedOption(ClassTab.step, 'data.attributes.hp.max', hitDice.getMax(), textBlob, {
      addValues: true,
      type: OptionType.TEXT,
    });
    const $hitPointSection = $('section', $('[data-hct_class_area=hit-points]', $context)).empty();
    hitPointsOption.render($hitPointSection);
    options.push(hitPointsOption);

    // saving throws
    const savingThrows: string[] = classItem.data.saves;
    const $savingThrowsSection = $('section', $('[data-hct_class_area=saving-throws]', $context)).empty();
    savingThrows.forEach((save) => {
      const savingThrowOption = new FixedOption(
        ClassTab.step,
        `data.abilities.${save}.proficient`,
        1,
        Utils.getAbilityNameByKey(save),
      );
      savingThrowOption.render($savingThrowsSection);
      options.push(savingThrowOption);
    });

    // proficiencies
    const $skillProficiencySection: JQuery = $('section', $('[data-hct_class_area=proficiencies]', $context)).empty();
    const skillsContainer: OptionsContainer = new OptionsContainer(
      game.i18n.localize('HCT.Common.SkillProficiencies'),
      [
        new MultiOption(
          ClassTab.step,
          'skills',
          classItem.data.skills.choices.map((s: string) => ({ key: s, value: Utils.getSkillNameByKey(s) })),
          classItem.data.skills.number,
          ' ',
          { addValues: true },
        ),
      ],
    );
    skillsContainer.render($skillProficiencySection);
    options.push(...skillsContainer.options);

    // class features
    const $featuresSection = $('section', $('[data-hct_class_area=features]', $context)).empty();
    const classFeatures: Item[] = Utils.filterItemList({
      filterValues: [`${classItem.name} ${1}`],
      filterField: 'data.requirements',
      itemList: this.classFeatures!,
    });
    classFeatures.forEach((feature) => {
      const featureOption = new FixedOption(ClassTab.step, 'items', feature, '', {
        addValues: true,
        type: OptionType.ITEM,
      });
      featureOption.render($featuresSection);
      options.push(featureOption);
    });

    $('[data-hct_class_data]').show();
    return options;
  }
}
const ClassTab: Step = new _Class();
export default ClassTab;

function setClassPickerOptions(classes: Item[]) {
  const picker = $('[data-hct_class_picker]');
  for (const clazz of classes) {
    picker.append($(`<option value='${clazz.name}'>${clazz.name}</option>`));
  }
}

//===============================================================

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

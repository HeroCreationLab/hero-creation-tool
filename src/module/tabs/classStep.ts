/*
  Functions used exclusively on the Class tab
*/
import { Step, StepEnum } from '../Step';
import * as Constants from '../constants';
import * as Utils from '../utils';
import { Settings } from '../settings';
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
    const classCompendiums: string[] = [Constants.DND5E_COMPENDIUMS.CLASSES];
    const classCustomPack = (await game.settings.get(Constants.MODULE_NAME, Settings.CLASS_PACKS)) as string;
    if (classCustomPack) {
      classCompendiums.push(classCustomPack);
    }
    const classItems = await Utils.getItemListFromCompendiumListByNames(classCompendiums);
    this.classes = classItems?.sort((a, b) => a.name.localeCompare(b.name)) as any;
    if (this.classes) setClassPickerOptions(this.classes);
    else ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Classes' }));

    // class features
    const classFeatureCompendiums: string[] = [Constants.DND5E_COMPENDIUMS.CLASS_FEATURES];
    const classFeatureCustomPack = (await game.settings.get(
      Constants.MODULE_NAME,
      Settings.CLASS_FEATURE_PACKS,
    )) as string;
    if (classFeatureCustomPack) {
      classFeatureCompendiums.push(classFeatureCustomPack);
    }
    const classFeeatureItems = await Utils.getItemListFromCompendiumListByNames(classFeatureCompendiums);
    this.classFeatures = classFeeatureItems?.sort((a, b) => a.name.localeCompare(b.name)) as any;
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
    const classFeatures: Item[] = getClassFeaturesForClassNameAndLevel(classItem.name, 1, this.classFeatures);
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

function getClassFeaturesForClassNameAndLevel(className: string, level: number, classFeatures?: Item[]): Item[] {
  if (!classFeatures) return [];
  const requirement = `${className} ${level}`;
  const filtered = classFeatures.filter((cf: any) => {
    const req: string = cf.data.requirements;
    if (req.indexOf(',')) {
      // feature applies for multiple classes / levels
      const reqs: string[] = req.split(',').map((r) => r.trim());
      return reqs.indexOf(requirement) > -1;
    } else {
      return req === requirement;
    }
  });
  return filtered;
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

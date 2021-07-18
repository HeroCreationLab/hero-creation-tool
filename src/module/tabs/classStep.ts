/*
  Functions used exclusively on the Class tab
*/
import { Step, StepEnum } from '../Step';
import * as Constants from '../constants';
import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import SettingKeys from '../settings';
import HiddenOption from '../options/HiddenOption';
import FixedOption, { OptionType } from '../options/FixedOption';

class _Class extends Step {
  private classes?: Item[] = [];
  private classFeatures?: Item[] = [];
  private _class!: Item;
  constructor() {
    super(StepEnum.Class);
  }

  getUpdateData() {
    return { item: this._class };
  }

  section = () => $('#classDiv');

  setListeners(): void {
    $('[data-hct_class_picker]', this.section()).on('change', async (event) => {
      this.clearOptions();
      const className: string = $(event.currentTarget).val() as string;
      this._class = this.classes!.filter((c) => c.name === className)[0] as any;
      if (this.classes) {
        this.updateClass(this.section());
      } else ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Classes' }));
    });
  }

  async setSourceData() {
    // classes
    const classItems = await Utils.getSources({
      baseSource: Constants.DEFAULT_PACKS.CLASSES,
      customSourcesProperty: SettingKeys.CUSTOM_CLASS_PACKS,
    });
    this.classes = classItems?.sort((a, b) => a.name.localeCompare(b.name)) as any;
    if (this.classes) setClassPickerOptions(this.classes);
    else ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Classes' }));

    // class features
    const classFeatureItems = await Utils.getSources({
      baseSource: Constants.DEFAULT_PACKS.CLASS_FEATURES,
      customSourcesProperty: SettingKeys.CUSTOM_CLASS_FEATURE_PACKS,
    });
    this.classFeatures = classFeatureItems?.sort((a, b) => a.name.localeCompare(b.name)) as any;
  }

  renderData(): void {
    $('[data-hct_class_data]', this.section()).hide();
  }

  updateClass($section: JQuery) {
    const $context = $('[data-hct_class_data]', $section);
    this.clearOptions();

    // icon, description and class item
    $('[data-hct_class_icon]', $section).attr('src', this._class.img);
    $('[data-hct_class_description]', $section).html(
      TextEditor.enrichHTML((this._class.data as any).description.value),
    );
    this.stepOptions.push(new HiddenOption(ClassTab.step, 'items', [this._class], { addValues: true }));

    this.setHitPointsUi($context);
    this.setSavingThrowsUi($context);
    this.setProficienciesUi($context);
    this.setClassFeaturesUi($context);

    this.setSpellcastingAbilityIfExisting();

    $('[data-hct_class_data]').show();
    return;
  }

  private setSpellcastingAbilityIfExisting() {
    const spellCastingAbility = (this._class?.data as any)?.spellcasting?.ability;
    if (spellCastingAbility) {
      this.stepOptions.push(
        new FixedOption(StepEnum.Spells, 'data.attributes.spellcasting', spellCastingAbility, '', {
          addValues: false,
          type: OptionType.TEXT,
        }),
      );
    }
  }

  private setProficienciesUi($context: JQuery<HTMLElement>) {
    const $proficiencySection: JQuery = $('section', $('[data-hct_class_area=proficiencies]', $context)).empty();
    const foundrySkills = (game as any).dnd5e.config.skills;
    ProficiencyUtils.prepareSkillOptions({
      step: this.step,
      $parent: $proficiencySection,
      pushTo: this.stepOptions,
      filteredOptions: (this._class.data as any).skills.choices.map((s: string) => ({
        key: s,
        value: foundrySkills[s],
      })),
      quantity: (this._class.data as any).skills.number,
      addValues: true,
      expandable: false,
      customizable: false,
    });

    ProficiencyUtils.prepareWeaponOptions({
      step: this.step,
      $parent: $proficiencySection,
      pushTo: this.stepOptions,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    });

    ProficiencyUtils.prepareArmorOptions({
      step: this.step,
      $parent: $proficiencySection,
      pushTo: this.stepOptions,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    });

    ProficiencyUtils.prepareToolOptions({
      step: this.step,
      $parent: $proficiencySection,
      pushTo: this.stepOptions,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    });

    ProficiencyUtils.prepareLanguageOptions({
      step: this.step,
      $parent: $proficiencySection,
      pushTo: this.stepOptions,
      quantity: 0,
      addValues: true,
      expandable: true,
      customizable: true,
    });
  }

  private setClassFeaturesUi($context: JQuery<HTMLElement>) {
    const $featuresSection = $('section', $('[data-hct_class_area=features]', $context)).empty();
    const classFeatures: Item[] = Utils.filterItemList({
      filterValues: [`${this._class.name} ${1}`],
      filterField: 'data.requirements',
      itemList: this.classFeatures!,
    });
    classFeatures.forEach((feature) => {
      const featureOption = new FixedOption(ClassTab.step, 'items', feature, undefined, {
        addValues: true,
        type: OptionType.ITEM,
      });
      featureOption.render($featuresSection);
      this.stepOptions.push(featureOption);
    });
  }

  private setSavingThrowsUi($context: JQuery<HTMLElement>) {
    const savingThrows: string[] = (this._class as any).data.saves;
    const foundryAbilities = (game as any).dnd5e.config.abilities;
    const $savingThrowsSection = $('section', $('[data-hct_class_area=saving-throws]', $context)).empty();
    savingThrows.forEach((save) => {
      const savingThrowOption = new FixedOption(
        ClassTab.step,
        `data.abilities.${save}.proficient`,
        1,
        foundryAbilities[save],
      );
      savingThrowOption.render($savingThrowsSection);
      this.stepOptions.push(savingThrowOption);
    });
  }

  private setHitPointsUi($context: JQuery<HTMLElement>) {
    const hitDice = new HitDice((this._class as any).data.hitDice);
    const textBlob = game.i18n.format('HCT.Class.HitPointsBlob', {
      max: hitDice.getMax(),
    });
    const hitPointsOption = new FixedOption(ClassTab.step, 'data.attributes.hp.max', hitDice.getMax(), textBlob, {
      addValues: true,
      type: OptionType.TEXT,
    });
    const $hitPointSection = $('section', $('[data-hct_class_area=hit-points]', $context)).empty();
    hitPointsOption.render($hitPointSection);
    this.stepOptions.push(hitPointsOption);
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

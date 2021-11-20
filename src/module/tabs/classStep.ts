/*
  Functions used exclusively on the Class tab
*/
import { Step, StepEnum } from '../Step';
import * as CONSTANTS from '../constants';
import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import HiddenOption from '../options/HiddenOption';
import FixedOption, { OptionType } from '../options/FixedOption';
import SelectableIndexEntryOption from '../options/SelectableIndexEntryOption';
import SearchableIndexEntryOption from '../options/SearchableIndexEntryOption';
import { HitDie } from '../HitDie';
import { ClassLevel } from '../ClassLevel';
import { ClassEntry, ClassFeatureEntry, getClassEntries, getClassFeatureEntries } from '../indexUtils';

class _Class extends Step {
  private classes?: ClassEntry[] = [];
  private classFeatures?: ClassFeatureEntry[] = [];
  private _class?: ClassEntry;
  private primaryClassLevel: ClassLevel = 1;
  private primaryClassHitDie: HitDie | null = null;
  constructor() {
    super(StepEnum.Class);
  }

  spellcasting!: { item: ClassFeatureEntry; ability: string; progression: string };

  getUpdateData() {
    return this._class
      ? {
          name: this._class.name,
          spellcasting: this.spellcasting,
          level: this.primaryClassLevel,
          hitDie: this.primaryClassHitDie,
          hpMethod: (document.querySelector('input[name="higher-lv-hp"]:checked') as HTMLInputElement)?.value ?? 'avg',
        }
      : undefined;
  }

  section = () => $('#classDiv');

  setListeners(): void {
    // do nothing
  }

  async setSourceData() {
    // classes
    const classItems = await getClassEntries();
    this.classes = classItems?.sort((a, b) => a.name.localeCompare(b.name));
    if (!this.classes) ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Classes' }));

    // class features
    const classFeatureItems = await getClassFeatureEntries();
    this.classFeatures = classFeatureItems?.sort((a, b) => a.name.localeCompare(b.name)) as any;
  }

  private $primaryClassLevelSelect!: HTMLSelectElement;
  renderData(): void {
    Utils.setPanelScrolls(this.section());
    $('[data-hct_class_data]', this.section()).hide();

    const searchableOption = new SearchableIndexEntryOption(
      this.step,
      'item',
      this.classes!,
      (classId) => {
        // callback on selected
        this.clearOptions();
        this._class = this.classes!.find((c) => c._id === classId);
        if (!this._class) {
          throw new Error(`Error finding class with name ${classId}`);
        }
        if (this.classes) {
          this.updateClass(this.section());
          this.primaryClassLevel = 1;
          this.$primaryClassLevelSelect.disabled = false;
          this.$primaryClassLevelSelect.selectedIndex = 0;
        } else ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Classes' }));
      },
      game.i18n.localize('HCT.Class.Select.Default'),
    );
    const $classSearch = $('[data-hct-class-search]');
    searchableOption.render($classSearch, { prepend: true });
    this.$primaryClassLevelSelect = addLevelSelect($classSearch, 'class');
    this.$primaryClassLevelSelect.disabled = true;
    this.$primaryClassLevelSelect.addEventListener('change', (event) => {
      this.primaryClassLevel = parseInt((event.target as any)?.value) as ClassLevel;
      this.updateClass(this.section());
    });
  }

  updateClass($section: JQuery) {
    const $context = $('[data-hct_class_data]', $section);
    this.clearOptions();

    // icon, description and class item
    $('[data-hct_class_icon]', $section).attr('src', this._class?.img || CONSTANTS.MYSTERY_MAN);
    $('[data-hct_class_description]', $section).html(
      TextEditor.enrichHTML(this._class?.data?.description?.value ?? ''),
    );
    if (!this._class) {
      throw new Error(`Error finding current class`);
    }
    this._class.data.levels = this.primaryClassLevel;
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

  private async setProficienciesUi($context: JQuery<HTMLElement>) {
    const $proficiencySection: JQuery = $('section', $('[data-hct_class_area=proficiencies]', $context)).empty();
    const foundrySkills = (game as any).dnd5e.config.skills;
    const options = [];

    options.push(
      ProficiencyUtils.prepareSkillOptions({
        step: this.step,
        $parent: $proficiencySection,
        pushTo: this.stepOptions,
        filteredOptions: this._class!.data.skills.choices.map((s: string) => ({
          key: s,
          value: foundrySkills[s],
        })),
        quantity: this._class!.data.skills.number,
        addValues: true,
        expandable: false,
        customizable: false,
      }),
    );

    options.push(
      await ProficiencyUtils.prepareWeaponOptions({
        step: this.step,
        $parent: $proficiencySection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.push(
      await ProficiencyUtils.prepareArmorOptions({
        step: this.step,
        $parent: $proficiencySection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.push(
      await ProficiencyUtils.prepareToolOptions({
        step: this.step,
        $parent: $proficiencySection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.push(
      ProficiencyUtils.prepareLanguageOptions({
        step: this.step,
        $parent: $proficiencySection,
        pushTo: this.stepOptions,
        quantity: 0,
        addValues: true,
        expandable: true,
        customizable: true,
      }),
    );

    options.forEach((o) => o.render($proficiencySection));
    this.stepOptions.push(...options);
  }

  private setClassFeaturesUi($context: JQuery<HTMLElement>) {
    const $featuresSection = $('section', $('[data-hct_class_area=features]', $context)).empty();
    let classFeatures = Utils.filterItemList({
      filterValues: [...Array(this.primaryClassLevel).keys()].map((k) => `${this._class!.name} ${k + 1}`),
      filterField: 'data.requirements',
      itemList: this.classFeatures!,
    });
    // handle fighting style
    const fightingStyles = classFeatures.filter((i) => (i as any).name.startsWith('Fighting Style'));
    classFeatures = classFeatures.filter((i) => !(i as any).name.startsWith('Fighting Style'));

    const spellcastingItem = classFeatures.find(
      (i) => (i as any).name.startsWith('Spellcasting') || (i as any).name.startsWith('Pact Magic'),
    );
    if (spellcastingItem) {
      this.spellcasting = {
        item: spellcastingItem,
        ability: this._class!.data.spellcasting.ability,
        progression: this._class!.data.spellcasting.progression,
      };
    }

    if (fightingStyles && fightingStyles.length > 0) {
      const fsOption = new SelectableIndexEntryOption(StepEnum.Class, 'items', fightingStyles, {
        addValues: true,
        placeholderName: 'Fighting Style',
      });
      fsOption.render($featuresSection);
      this.stepOptions.push(fsOption);
    }

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
    this.primaryClassHitDie = new HitDie((this._class as any).data.hitDice);
    $('[data-hct-class-hp-lv1]', $context).text(this.primaryClassHitDie.getMax());
    $('[data-hct-class-hp-higher-lv]', $context).text(this.primaryClassHitDie.getVal());
  }
}
const ClassTab: Step = new _Class();
export default ClassTab;

function addLevelSelect($parent: JQuery, className: string) {
  const $select = document.createElement('select');
  $select.setAttribute(`data-hct-${className}-level`, '');
  $select.classList.add('hct-margin-l-tiny');
  for (let i = 1; i <= 20; i++) {
    const $opt = document.createElement('option');
    $opt.value = i + '';
    $opt.text = `Level ${i}`;
    $select.appendChild($opt);
  }
  $parent.append($select);

  return $select;
}

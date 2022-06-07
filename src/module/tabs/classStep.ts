/*
  Functions used exclusively on the Class tab
*/
import { Step, StepEnum } from '../step';
import * as Utils from '../utils';
import * as ProficiencyUtils from '../proficiencyUtils';
import HiddenOption from '../options/hiddenOption';
import FixedOption, { OptionType } from '../options/fixedOption';
import SelectableIndexEntryOption from '../options/selectableIndexEntryOption';
import SearchableIndexEntryOption from '../options/searchableIndexEntryOption';
import { HitDie } from '../hitDie';
import {
  getIndexEntryByUuid,
  ClassEntry,
  getClassEntries,
  ClassFeatureEntry,
  SubclassEntry,
  getSubclassEntries,
} from '../indexes/indexUtils';
import SettingKeys from '../settings';
import { MYSTERY_MAN, CLASS_LEVEL, NONE_ICON } from '../constants';
import * as Advancements from '../advancementUtils';
import { getGame } from '../utils';

export type ClassSpellcastingData = {
  description?: string;
  ability: string;
  progression: string;
};

class _Class extends Step {
  private classes?: ClassEntry[] = [];
  private subclasses?: SubclassEntry[] = [];

  private _class?: ClassEntry;
  private selectedSubclass: SubclassEntry | undefined;

  private primaryClassLevel: CLASS_LEVEL = 1;
  private primaryClassHitDie: HitDie | null = null;
  constructor() {
    super(StepEnum.Class);
  }

  private spellGrantingString!: string[];
  private fightingStyleString!: string;
  private spellcasting?: ClassSpellcastingData;

  private $classIcon!: JQuery;
  private $classDesc!: JQuery;

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
    this.classes = (await getClassEntries())?.sort((a, b) => a.name.localeCompare(b.name));
    this.subclasses = (await getSubclassEntries())?.sort((a, b) => a.name.localeCompare(b.name));

    if (!this.classes) ui.notifications!.error(game.i18n.format('HCT.Error.RenderLoad', { value: 'Classes' }));

    this.spellGrantingString = (Utils.getModuleSetting(SettingKeys.SPELL_GRANTING_STRING) as string).split(';');
    this.fightingStyleString = Utils.getModuleSetting(SettingKeys.FIGHTING_STYLE_STRING) as string;
  }

  private $primaryClassLevelSelect!: HTMLSelectElement;
  renderData(): void {
    Utils.setPanelScrolls(this.section());
    const $dataSection = $('[data-hct_class_data]', this.section());
    this.$classIcon = $('[data-hct_class_icon]', this.section());
    this.$classDesc = $('[data-hct_class_description]', this.section());
    $dataSection.hide();

    const searchableOption = new SearchableIndexEntryOption(
      this.step,
      'items',
      this.classes!,
      (classId) => {
        // callback on selected
        this.clearOptions();
        if (!classId) {
          $dataSection.hide();
          this.$classIcon.attr('src', NONE_ICON);
          this.$classDesc.html(getGame().i18n.localize('HCT.Class.DescriptionPlaceholder'));
          return;
        }
        this._class = this.classes!.find((c) => c._id === classId);
        if (!this._class) {
          throw new Error(`Error finding class with name ${classId}`);
        }
        if (this.classes) {
          this.updateClass(this.section());
          this.$primaryClassLevelSelect.disabled = false;
        } else ui.notifications!.error(game.i18n.format('HCT.Error.UpdateValueLoad', { value: 'Classes' }));
      },
      game.i18n.localize('HCT.Class.Select.Default'),
      true,
    );
    const $classSearch = $('[data-hct-class-search]');
    searchableOption.render($classSearch, { prepend: true });
    this.$primaryClassLevelSelect = addLevelSelect($classSearch, 'class');
    this.$primaryClassLevelSelect.disabled = true;
    this.$primaryClassLevelSelect.addEventListener('change', (event) => {
      this.primaryClassLevel = parseInt((event.target as any)?.value) as CLASS_LEVEL;
      this.updateClass(this.section());
    });
  }

  async updateClass($section: JQuery) {
    const $context = $('[data-hct_class_data]', $section);
    this.clearOptions();

    // icon, description and class item
    this.$classIcon.attr('src', this._class?.img || MYSTERY_MAN);
    this.$classDesc.html(TextEditor.enrichHTML(this._class?.data?.description?.value ?? ''));
    if (!this._class) {
      throw new Error(`Error finding current class`);
    }
    this._class.data.levels = this.primaryClassLevel;
    this.stepOptions.push(new HiddenOption(ClassTab.step, 'items', [this._class], { addValues: true }));

    const advancementsUpToSelectedLevel = await Advancements.getAdvancementsUpToLevel(
      this._class,
      this.primaryClassLevel,
    );
    const classFeatures: ClassFeatureEntry[] = [];
    if (advancementsUpToSelectedLevel?.length) {
      const itemGrantAdvancements = Advancements.filterItemGrantAdvancements(advancementsUpToSelectedLevel);
      if (itemGrantAdvancements.length) {
        const grantedItems = (await Promise.all(
          itemGrantAdvancements.flatMap((iga) => iga.data.configuration.items).map(getIndexEntryByUuid),
        )) as ClassFeatureEntry[]; // TODO see if we can properly type this

        classFeatures.push(...grantedItems);
      }

      const hitPointsAdvancement = Advancements.filterHitPointsAdvancements(advancementsUpToSelectedLevel);
      if (itemGrantAdvancements.length) {
        // manejar HP

        console.log(hitPointsAdvancement);
      }
    }

    const subclassesForClass =
      this.subclasses?.filter((sc) => sc.data.classIdentifier === this._class?.data.identifier) ?? [];
    this.setSubclassUi($context, subclassesForClass);
    this.setHitPointsUi($context);
    this.setSavingThrowsUi($context);
    this.setProficienciesUi($context);
    this.setClassFeaturesUi($context, classFeatures);

    this.setSpellcastingAbilityIfExisting();

    $('[data-hct_class_data]').show();
    return;
  }

  private setSubclassUi($context: JQuery<HTMLElement>, subclasses: SubclassEntry[]) {
    const $section = $('section', $('[data-hct_class_area=subclass]', $context)).empty();

    const handleSubclassChange = (subclassId: string | null) => {
      if (!subclassId) {
        this.selectedSubclass = undefined;

        return;
      }
      console.log(`selected ${subclassId}`);
      this.selectedSubclass = this.subclasses!.find((c) => c._id === subclassId);
      console.log(this.selectedSubclass);
    };

    const searchableSubclassOption = new SearchableIndexEntryOption(
      this.step,
      'items',
      subclasses,
      (subclassId) => handleSubclassChange(subclassId),
      game.i18n.localize('HCT.Class.Select.DefaultSubclass'),
    );
    searchableSubclassOption.render($section, { prepend: true });
    this.stepOptions.push(searchableSubclassOption);
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

  private async setClassFeaturesUi($context: JQuery<HTMLElement>, classFeatures: ClassFeatureEntry[]) {
    const $featuresSection = $('section', $('[data-hct_class_area=features]', $context)).empty();

    // TODO handle fighting style outside of this function
    const fightingStyles = classFeatures.filter((i) => i.name.startsWith(this.fightingStyleString));
    classFeatures = classFeatures.filter((i) => !i.name.startsWith(this.fightingStyleString));

    // TODO handle spellcasting/pact magic outside of this function
    if (this._class?.data.spellcasting.progression === 'none') {
      this.spellcasting = undefined;
    } else {
      this.spellcasting = {
        description: classFeatures.find((i) => this.spellGrantingString.some((s) => i.name.includes(s)))?.data
          .description.value,
        ability: this._class!.data.spellcasting.ability,
        progression: this._class!.data.spellcasting.progression,
      };
    }

    if (fightingStyles && fightingStyles.length > 0) {
      const fsOption = new SelectableIndexEntryOption(StepEnum.Class, 'items', fightingStyles, {
        addValues: true,
        placeholderName: this.fightingStyleString,
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
  for (let i = 1; i <= 20; i++) {
    const $opt = document.createElement('option');
    $opt.value = i + '';
    $opt.text = game.i18n.format(`HCT.Class.Level`, { lv: i });
    $select.appendChild($opt);
  }
  $parent.append($select);

  return $select;
}

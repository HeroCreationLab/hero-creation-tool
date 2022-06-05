import { DEFAULT_PACKS, LOG_PREFIX, MODULE_ID } from './constants';
import SettingKeys from './settings';

export default class CompendiumSourcesSubmenu extends FormApplication {
  constructor() {
    super({});
    this.baseCompendiumList = game.packs.filter((p) => p.documentName === 'Item');
  }

  baseCompendiumList: any;

  static get defaultOptions() {
    return mergeObject(super.defaultOptions, {
      classes: ['form'],
      popOut: true,
      width: 400,
      height: 400,
      template: `/modules/hero-creation-tool/templates/sources-submenu.html`,
      id: 'hct-settings-submenu',
      title: 'Hero Creation Tool - Sources',
      resizable: false,
    });
  }

  activateListeners(html: JQuery) {
    super.activateListeners(html);
  }

  getData() {
    let selected: any = game.settings.get(MODULE_ID, SettingKeys.SOURCES);
    if (foundry.utils.isObjectEmpty(selected)) {
      selected = {
        races: [DEFAULT_PACKS.RACES],
        racialFeatures: [DEFAULT_PACKS.RACE_FEATURES],
        classes: [DEFAULT_PACKS.CLASSES],
        classFeatures: [DEFAULT_PACKS.CLASS_FEATURES],
        backgrounds: [DEFAULT_PACKS.BACKGROUNDS],
        spells: [DEFAULT_PACKS.SPELLS],
        feats: [],
        items: [DEFAULT_PACKS.ITEMS],
      };
    }
    const data = buildTemplateData({
      compendiaList: this.baseCompendiumList,
      selectedCompendia: selected,
    });
    return data as any;
  }

  _updateObject(event: Event, formData?: any) {
    console.log(`${LOG_PREFIX} | Saving compendia sources:`);
    console.log(formData);
    return game.settings.set(MODULE_ID, SettingKeys.SOURCES, formData);
  }
}

function buildCompendiaList(compendiaList: any[], defaultCollection?: string[]) {
  return compendiaList.map((p: any) => {
    return {
      collection: p.collection as string,
      label: `${p.metadata.label} [${p.metadata.package}]`,
      checked: defaultCollection?.includes(p.collection),
    };
  });
}

type BuildData = {
  compendiaList: any[];
  selectedCompendia: {
    races: string[];
    racialFeatures: string[];
    classes: string[];
    classFeatures: string[];
    backgrounds: string[];
    spells: string[];
    feats: string[];
    items: string[];
  };
};
function buildTemplateData({ compendiaList, selectedCompendia }: BuildData) {
  return {
    source: {
      races: {
        label: game.i18n.localize('HCT.Setting.Sources.RaceCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.races),
      },
      racialFeatures: {
        label: game.i18n.localize('HCT.Setting.Sources.RacialFeatureCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.racialFeatures),
      },
      classes: {
        label: game.i18n.localize('HCT.Setting.Sources.ClassCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.classes),
      },
      classFeatures: {
        label: game.i18n.localize('HCT.Setting.Sources.ClassFeatureCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.classFeatures),
      },
      backgrounds: {
        label: game.i18n.localize('HCT.Setting.Sources.BackgroundCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.backgrounds),
      },
      spells: {
        label: game.i18n.localize('HCT.Setting.Sources.SpellCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.spells),
      },
      feats: {
        label: game.i18n.localize('HCT.Setting.Sources.FeatCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.feats),
      },
      items: {
        label: game.i18n.localize('HCT.Setting.Sources.EquipmentCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.items),
      },
    },
  };
}

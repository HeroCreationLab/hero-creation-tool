import * as Constants from './constants';
import SettingKeys, { SourceType } from './settings';

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

    const coll = $('.hct-collapsible', html);
    let i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener('click', function () {
        this.classList.toggle('active');
        const content = this.nextElementSibling as any;
        if (content.style.display === 'block') {
          content.style.display = 'none';
        } else {
          content.style.display = 'block';
        }
      });
    }
  }

  getData() {
    const val: any = game.settings.get(Constants.MODULE_NAME, SettingKeys.SOURCES);
    let selected;
    if (foundry.utils.isObjectEmpty(val)) {
      selected = {
        races: [Constants.DEFAULT_PACKS.RACES],
        racialFeatures: [Constants.DEFAULT_PACKS.RACE_FEATURES],
        classes: [Constants.DEFAULT_PACKS.CLASSES],
        classFeatures: [Constants.DEFAULT_PACKS.CLASS_FEATURES],
        backgroundFeatures: [],
        spells: [Constants.DEFAULT_PACKS.SPELLS],
        feats: [],
      };
    } else {
      selected = pruneUnselectedPacks(val);
    }
    const data = buildTemplateData({
      compendiaList: this.baseCompendiumList,
      selectedCompendia: selected,
    });
    return data as any;
  }

  _updateObject(event: Event, formData?: Record<string, unknown>) {
    let data: any;
    if (formData) {
      data = formData;
    }
    const savedData: any = {};
    for (const k of Object.keys(data)) {
      const key = k as SourceType;
      savedData[key] = data[k].reduce((map: any, obj: any, index: number) => {
        const c = this.baseCompendiumList[index];
        map[c.collection] = obj;
        return map;
      }, {});
    }
    console.log(`${Constants.LOG_PREFIX} | Saving compendia sources:`);
    console.log(savedData);
    return game.settings.set(Constants.MODULE_NAME, SettingKeys.SOURCES, savedData);
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
    backgroundFeatures: string[];
    spells: string[];
    feats: string[];
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
      backgroundFeatures: {
        label: game.i18n.localize('HCT.Setting.Sources.BackgroundFeatureCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.backgroundFeatures),
      },
      spells: {
        label: game.i18n.localize('HCT.Setting.Sources.SpellCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.spells),
      },
      feats: {
        label: game.i18n.localize('HCT.Setting.Sources.FeatCompendia'),
        compendia: buildCompendiaList(compendiaList, selectedCompendia.feats),
      },
    },
  };
}

function pruneUnselectedPacks(val: any): any {
  return Object.keys(val).reduce((map: any, acc) => {
    map[acc] = Object.keys(val[acc]).filter((pack) => val[acc][pack]);
    return map;
  }, {});
}

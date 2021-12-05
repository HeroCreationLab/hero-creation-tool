import * as Constants from './constants';
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

    const coll = $('.hct-collapsible', html);
    let i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener('click', function () {
        this.classList.toggle('active');
        const child = this.firstElementChild;
        const content = this.nextElementSibling as any;
        if (content.style.display === 'block') {
          content.style.display = 'none';
          child?.classList.remove('fa-chevron-down');
          child?.classList.add('fa-chevron-right');
        } else {
          content.style.display = 'block';
          child?.classList.remove('fa-chevron-right');
          child?.classList.add('fa-chevron-down');
        }
      });
    }
  }

  getData() {
    let selected: any = game.settings.get(Constants.MODULE_NAME, SettingKeys.SOURCES);
    if (foundry.utils.isObjectEmpty(selected)) {
      selected = {
        races: [Constants.DEFAULT_PACKS.RACES],
        racialFeatures: [Constants.DEFAULT_PACKS.RACE_FEATURES],
        classes: [Constants.DEFAULT_PACKS.CLASSES],
        classFeatures: [Constants.DEFAULT_PACKS.CLASS_FEATURES],
        backgroundFeatures: [],
        spells: [Constants.DEFAULT_PACKS.SPELLS],
        feats: [],
      };
    }
    const data = buildTemplateData({
      compendiaList: this.baseCompendiumList,
      selectedCompendia: selected,
    });
    return data as any;
  }

  _updateObject(event: Event, formData?: any) {
    console.log(`${Constants.LOG_PREFIX} | Saving compendia sources:`);
    console.log(formData);
    return game.settings.set(Constants.MODULE_NAME, SettingKeys.SOURCES, formData);
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

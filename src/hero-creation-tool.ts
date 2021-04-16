/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import { Constants } from './constants.js'
import { Utils } from './utils.js'
import HeroData from './types/ActorData.js'

import { Tab } from './tabs/Tab.js'
import BasicsTab from './tabs/basics.js'
import AbilitiesTab from './tabs/abilities.js'
import RaceTab from './tabs/race.js'
import ClassTab from './tabs/class.js'
import BackgroundTab from './tabs/background.js'
import EquipmentTab from './tabs/equipment.js'
import SpellsTab from './tabs/spells.js'
import BioTab from './tabs/bio.js'
import ReviewTab from './tabs/review.js'

export default class HeroCreationTool extends Application {
    newActor: HeroData;
    actorId: string;
    app: any;
    html: JQuery;
    tabs: Array<Tab>;

    constructor(app: any, html: JQuery) {
        super();
        this.app = app;
        this.html = html;
        this.newActor = new HeroData();
        this.tabs = [BasicsTab, AbilitiesTab, RaceTab, ClassTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab, ReviewTab];
    }

    static get defaultOptions() {
        const options = super.defaultOptions;
        options.template = Constants.MODULE_PATH + "/templates/app.html";
        options.width = 700;
        options.height = 700;
        options.title = "Hero Creation";
        return options;
    }

    async openForActor(actorId: string) {
        console.log(`${Constants.LOG_PREFIX} | Opening for ${actorId ? 'actor id: ' + actorId : 'new actor'}`);
        this.actorId = actorId;
        this.render(true);
    }

    activateListeners(html: JQuery) {
        super.activateListeners(html);
        console.log(`${Constants.LOG_PREFIX} | Binding listeners`);

        // listeners specific for each tab
        for (const tab of this.tabs) {
            tab.setListeners();
        }

        // set listeners for tab navigation
        $('[data-hct_tab]').on('click', function () {
            Utils.openTab($(this).data('hct_tab'));
        })
        $('[data-hct_back]').on('click', function () {
            Utils.openTab($(this).data('hct_back'));
        })
        $('[data-hct_next]').on('click', function () {
            Utils.openTab($(this).data('hct_next'));
        })

        $('#finalSubmit').on('click', (event) => {
            this.buildActor(this.newActor);
            this.close();
        });
    };

    async buildActor(newActor: HeroData) {
        console.log(`${Constants.LOG_PREFIX} | Building actor`);

        // tab.saveData validates that data is complete on the tab, and saves it to the newActor
        let validData = true;
        for (const tab of this.tabs) {
            validData = tab.saveData(newActor) && validData;
        }

        // Creates new actor based on collected data only if data from all tabs is valid
        if (validData) Actor.create(newActor);
    }
}
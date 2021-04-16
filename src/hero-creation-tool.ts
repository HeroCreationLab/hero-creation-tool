/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import { Constants } from './constants.js'
import { Utils } from './utils.js'
import HeroData from './types/ActorData.js'

import { BasicsTab } from './tabs/basics.js'
import { AbilitiesTab } from './tabs/abilities.js'
import { RaceTab } from './tabs/race.js'
import { ClassTab } from './tabs/class.js'
import { BackgroundTab } from './tabs/background.js'
import { EquipmentTab } from './tabs/equipment.js'
import { SpellsTab } from './tabs/spells.js'
import { BioTab } from './tabs/bio.js'
import { ReviewTab } from './tabs/review.js'

export default class HeroCreationTool extends Application {
    newActor: HeroData;
    actorId: string;
    app: any;
    html: JQuery;

    constructor(app: any, html: JQuery) {
        super();
        this.app = app;
        this.html = html;
        this.newActor = new HeroData();
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

    async buildActor(newActor: HeroData) {
        console.log(`${Constants.LOG_PREFIX} | Building actor`);
        // Copies all the data in the tabs into the newActor
        BasicsTab.saveData(newActor);
        RaceTab.savaData(newActor);
        ClassTab.saveData(newActor);
        AbilitiesTab.saveData(newActor);
        BackgroundTab.saveData(newActor);
        EquipmentTab.saveData(newActor);
        BioTab.saveData(newActor);

        // Creates new actor based on collected data
        Actor.create(newActor);
    }

    activateListeners(html: JQuery) {
        super.activateListeners(html);
        console.log(`${Constants.LOG_PREFIX} | Binding listeners`);

        // listeners specific to a single tab
        BasicsTab.setListeners();
        RaceTab.setListeners();
        ClassTab.setListeners();
        AbilitiesTab.setListeners();
        BackgroundTab.setListeners();
        EquipmentTab.setListeners();
        SpellsTab.setListeners();
        BioTab.setListeners();
        ReviewTab.setListeners();

        // set listeners for tab navigation
        $('[data-hct_tab]').on('click', function () {
            Utils.openTab($(this).data('hct_tab'));
        })
        $('[data-hct_back]').on('click', function () {
            Utils.openTab($(this).data('hct_back'));
        })
        $('[data-hct_next]').on('click', function () {
            const validation = $(this).data('validation');
            if (validation) {
                if (true) { // TODO call validation
                    Utils.openTab($(this).data('hct_next'));
                }
            } else {
                Utils.openTab($(this).data('hct_next'));
            }
        })

        $('#finalSubmit').on('click', (event) => {
            this.buildActor(this.newActor);
            this.close();
        });
    };
}
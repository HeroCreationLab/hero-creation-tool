/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import { Constants } from './constants.js'
import { Utils } from './utils.js'
import HeroData from './types/ActorData.js'

import { DataTab } from './types/DataTab.js'
import BasicsTab from './tabs/basics.js'
import AbilitiesTab from './tabs/abilities.js'
import RaceTab from './tabs/race.js'
import ClassTab from './tabs/class.js'
import BackgroundTab from './tabs/background.js'
import EquipmentTab from './tabs/equipment.js'
import SpellsTab from './tabs/spells.js'
import BioTab from './tabs/bio.js'
import ReviewTab from './tabs/review.js'
import { DataError } from './types/DataError.js'

export default class HeroCreationTool extends Application {
    newActor: HeroData;
    actorId: string;
    app: any;
    html: JQuery;
    dataTabs: Array<DataTab>;

    constructor(app: any, html: JQuery) {
        super();
        this.app = app;
        this.html = html;
        this.newActor = new HeroData();
        this.dataTabs = [BasicsTab, AbilitiesTab, RaceTab, ClassTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab]; // review tab holds no data
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
        for (const tab of this.dataTabs) {
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

        $('[data-hct_trigger_review]').on('click', () => {
            ReviewTab.mapReviewItems(this.validateData());
        })

        $('#finalSubmit').on('click', (event) => {
            const errors: DataError[] = this.validateData();
            if (!errors.length) {
                this.buildActor();
                this.close();
            } else {
                for (const err of errors) {
                    ui.notifications.error(game.i18n.localize(err.message));
                }
            }
        });
    };

    validateData(): DataError[] {
        // tab.getErrors validates data on the tab, and returns an array of any errors found
        // an empty array therefore means no errors
        let errors: DataError[] = [];
        for (const tab of this.dataTabs) {
            errors = errors.concat(tab.getErrors());
        }
        return errors; // returns the array with all the errors found, so it can be shown on the review and/or notified
    }

    async buildActor() {
        console.log(`${Constants.LOG_PREFIX} | Building actor`);
        for (const tab of this.dataTabs) {
            tab.saveData(this.newActor)
        }

        // Creates new actor based on collected data
        Actor.create(this.newActor);
    }
}
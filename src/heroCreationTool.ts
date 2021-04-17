/* Coco Liang
 version 0.1
 This object is a pop-up window to edit the actor's inital levels and stuffs
 */
import { Constants } from './constants.js'
import { Utils } from './utils.js'
import HeroData from './types/ActorData.js'

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
import { Step } from './types/Step.js'
import Race from './types/Race.js'
import { DataPrep } from './dataPrep.js'

export default class HeroCreationTool extends Application {
    newActor: HeroData;
    actorId: string;
    readonly steps: Array<Step>;

    constructor() {
        super();
        this.newActor = new HeroData();
        this.steps = [BasicsTab, AbilitiesTab, RaceTab, ClassTab, BackgroundTab, EquipmentTab, SpellsTab, BioTab]; // review tab holds no data
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
        this.render(true, { log: true });
    }

    activateListeners() {
        console.log(`${Constants.LOG_PREFIX} | Binding listeners`);

        // listeners specific for each tab
        for (const step of this.steps) {
            step.setListeners();
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

        $('[data-hct_review]').on('click', () => {
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

    async setupData() {
        const races: Race[] = await DataPrep.setupRaces();
        RaceTab.setSourceData(races);

    }

    renderChildrenData() {
        for (const step of this.steps) {
            step.renderData();
        }
    }

    validateData(): DataError[] {
        // tab.getErrors validates data on the tab, and returns an array of any errors found
        // an empty array therefore means no errors
        let errors: DataError[] = [];
        for (const step of this.steps) {
            errors = errors.concat(step.getErrors());
        }
        return errors; // returns the array with all the errors found, so it can be shown on the review and/or notified
    }

    buildActor() {
        console.log(`${Constants.LOG_PREFIX} | Building actor`);
        for (const step of this.steps) {
            step.saveActorData(this.newActor);
        }

        // Creates new actor based on collected data
        Actor.create(this.newActor);
    }
}
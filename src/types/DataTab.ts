import HeroData from './ActorData.js'
import { DataError } from './DataError.js';
import { Step } from './Step.js';

export interface DataTab {
    // set all element listeners specific to this tab, if any
    setListeners(): void;

    // validate data on this tab and save it into newActor.
    // should show a notification and return false if there's any error
    // return true on valid data
    saveData(newActor: HeroData): void;

    // validate data on this tab
    // return a an array of error message i18n keys
    getErrors(): Array<DataError>;
}
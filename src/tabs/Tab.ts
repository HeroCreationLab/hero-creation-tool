import HeroData from '../types/ActorData.js'

export interface Tab {
    // set all element listeners specific to this tab, if any
    setListeners(): void;

    // validate data on this tab and save it into newActor.
    // should show a notification and return false if there's any error
    // return true on valid data
    saveData(newActor: HeroData): boolean;
}
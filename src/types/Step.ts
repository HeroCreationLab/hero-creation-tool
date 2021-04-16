import { DataError } from "./DataError.js"

export class Step {
    step: StepEnum;
    constructor(step: StepEnum) {
        this.step = step;
    }

    error(message: string): DataError {
        return new DataError(message, this.step);
    }
}

export enum StepEnum {
    Basics = 'basics',
    Race = 'race',
    Class = 'class',
    Abilities = 'abilities',
    Background = 'background',
    Equipment = 'equipment',
    Spells = 'spells',
    Biography = 'bio',
}
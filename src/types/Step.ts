import ActorData from "./ActorData.js"
import { DataError } from "./DataError.js"

export abstract class Step {
    readonly step: StepEnum;

    constructor(step: StepEnum) {
        this.step = step;
    }

    abstract setListeners(): void
    abstract setSourceData(sourceData: any | any[]): void
    abstract renderData(): void
    abstract saveActorData(newActor: ActorData): void
    abstract getErrors(): DataError[]

    protected error(message: string): DataError {
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
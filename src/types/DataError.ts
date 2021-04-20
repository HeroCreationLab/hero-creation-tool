import { StepEnum } from "./Step.js"

export class DataError {
    message: string;
    step: StepEnum;
    constructor(message: string, step: StepEnum) {
        this.message = message;
        this.step = step;
    }
}
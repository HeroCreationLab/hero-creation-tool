
export default class Race {
    name: string;
    source: string
    srd: boolean
    size: Size
    speed: number
    darkvision: number

    features: [
        {
            name: string
            description: string
        }
    ]

    constructor(name: string) {
        this.name = name;
    }
}

export enum Size {
    Tiny,
    Small,
    Medium,
    Large,
    Huge,
    Gargantuan
}
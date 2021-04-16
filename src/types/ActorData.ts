export default class ActorData {
    name: string;
    type: string;
    img: string;
    folder: any;
    sort: number;
    data: {
        details: {
            appearance: string,
            biography: {
                value: string
            },
        },
        abilities: {
            str: { value: number },
            dex: { value: number },
            con: { value: number },
            int: { value: number },
            wis: { value: number },
            cha: { value: number }
        }
    };
    token: {};
    items: [];
    flags: {};

    constructor() {
        this.type = "character";
        this.img = "icons/svg/mystery-man.svg";
        this.folder = null;
        this.sort = 12000;
    }
}
/**
 * This file mocks the FoundryVTT game global so that it can be used in testing
 */

//@ts-ignore
const local: Localization = {
    lang: '',
    translations: {},
    initialize: jest.fn(() => { return Promise.resolve(); }),
    localize: jest.fn((stringId: string) => { return ''; }),
    format: jest.fn((stringId: string, replacements: any) => { return ''; }),
    setLanguage: jest.fn((lang: string) => { return Promise.resolve(); })
};

// @ts-ignore
const user: User = {
    name: '',
    id: '',
    active: true,
    viewedScene: '',
    avatar: '',
    //character: {},
    permissions: [],
    isTrusted: false,
    isGM: false,
    isSelf: true,
    can: jest.fn((permission: string) => { return false; }),
    hasPermission: jest.fn((permission: string) => { return false; }),
    hasRole: jest.fn((role: string) => { return false; }),
    isRole: jest.fn((role: string) => { return false; }),
    setPermission: jest.fn((premission: string, allowed: boolean) => { }),
    assignHotbarMacro: jest.fn((macro: Macro | null, slot: number, { fromSlot }: { fromSlot?: number }): Promise<User> => { return Promise.resolve(user); }),
    getHotbarMacros: jest.fn((page?: number): Macro[] => { return []; })
};

// @ts-ignore
const game = {
    data: null,
    i18n: local,
    user: user,
    paused: true,
    // @ts-ignore
    settings: {
        get: jest.fn((moduleName: string, settingName: string): any => {
            switch (settingName) {
                default:
                    return true;
            }
        }),
        register: jest.fn((moduleName: string, settingName: string, data: any) => { }),
        set: jest.fn((moduleName: string, settingName: string, data: any) => { return Promise.resolve(true); })
    },
    time: {
        worldTime: 10,
        advance: jest.fn()
    },
    socket: {
        on: jest.fn(),
        emit: jest.fn()
    },
    combats: {
        size: 0,
        find: jest.fn((v) => {
            return v.call(undefined, { started: true });
        })
    },
    modules: {
        get: jest.fn()
    },
    Gametime: {
        DTC: {
            saveUserCalendar: jest.fn()
        }
    },
    users: {
        get: jest.fn(),
        find: jest.fn((v) => {
            return v.call(undefined, { isGM: false, active: true });
        })
    },
    scenes: null,
    packs: {
        get: jest.fn((packageName: string) => {
            return {
                getDocuments: jest.fn()
            }
        })
    }
};

// @ts-ignore
global.game = game;

// @ts-ignore
global.ui = {
    notifications: {
        info: jest.fn((message: string) => { }),
        warn: jest.fn((message: string) => { }),
        error: jest.fn((message: string) => { })
    }
};

/*
  Functions used exclusively on the Basics tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { Tab } from './Tab.js';

class _Basics implements Tab {
    setListeners(): void {
        $('[data-filepick]').on('click', function () {
            const pick = $(this).data('filepick');
            openFilePicker(pick);
        });
    }

    saveData(newActor: HeroData): boolean {
        console.log(`${Constants.LOG_PREFIX} | Saving Basics Tab data into actor`);

        newActor.name = $('#actor_name').val() as string;
        if (!newActor.name) {
            ui.notifications.error(game.i18n.localize("HTC.Tabs.Basics.NoName"));
            return false;
        }
        newActor.img = ($('#avatar_path').val() as string) || Constants.MYSTERY_MAN; // if it was somehow deleted, put the default again

        const dimSight = 60; // FIXME - this should depend on the race/class
        newActor.token = {
            actorLink: true,
            disposition: 1,
            img: $('#token_path').val() || Constants.MYSTERY_MAN,
            vision: true,
            dimSight: dimSight,
            bar1: { attribute: 'attributes.hp' },
            displayBars: game.settings.get('hero-creation-tool', 'displayBarsMode'),
            displayName: game.settings.get('hero-creation-tool', 'displayNameMode'),
        }
        return true;
    }
}
const BasicsTab: Tab = new _Basics();
export default BasicsTab;

function openFilePicker(input: string) {
    let path1 = '/'
    let fp2 = new FilePicker({
        type: 'image',
        current: path1,
        callback: (path: string) => {
            $(`#${input}_path`).val(path);
            $(`#${input}_img`).attr('src', path);
        },
    } as any)
    fp2.browse();
}
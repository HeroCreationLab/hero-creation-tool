/*
  Functions used exclusively on the Basics tab
*/
import HeroData from '../types/ActorData.js'
import { Utils } from '../utils.js'

export namespace BasicsTab {
    export function setListeners() {
        $('[data-filepick]').on('click', function () {
            const pick = $(this).data('filepick');
            openFilePicker(pick);
        });
    }

    export function saveData(newActor: HeroData) {
        Utils.log('Saving Basics Tab data into actor');

        newActor.name = $('#actor_name').val() as string;
        newActor.img = $('#avatar_path').val() as string;

        const dimSight = 60; // FIXME - this should depend on the race/class
        newActor.token = {
            actorLink: true,
            disposition: 1,
            img: $('#token_path').val(),
            vision: true,
            dimSight: dimSight,
            bar1: { attribute: 'attributes.hp' },
            displayBars: game.settings.get('hero-creation-tool', 'displayBarsMode'),
            displayName: game.settings.get('hero-creation-tool', 'displayNameMode'),
        }
    }
}

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
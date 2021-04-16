/*
  Functions used exclusively on the Basics tab
*/
import HeroData from '../types/ActorData.js'
import { Constants } from '../constants.js'
import { DataTab } from '../types/DataTab.js'
import { DataError } from '../types/DataError.js'
import { Step, StepEnum } from '../types/Step.js'

class _Basics extends Step implements DataTab {
    setListeners(): void {
        $('[data-filepick]').on('click', function () {
            const pick = $(this).data('filepick');
            openFilePicker(pick);
        });
    }

    getErrors(): DataError[] {
        const errors: DataError[] = [];
        if (!$('#actor_name').val()) {
            errors.push(this.error("HCT.Basics.NoName"));
        }
        return errors;
    }

    saveData(newActor: HeroData): void {
        console.log(`${Constants.LOG_PREFIX} | Saving Basics Tab data into actor`);

        newActor.name = $('#actor_name').val() as string;
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
    }
}
const BasicsTab: DataTab = new _Basics(StepEnum.Basics);
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
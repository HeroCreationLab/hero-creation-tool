/*
  Functions used exclusively on the Basics tab
*/
import HeroData from '../types/ActorData';
import * as Constants from '../constants';
import { DataError } from '../types/DataError';
import { Step, StepEnum } from '../types/Step';

class _Basics extends Step {
  constructor() {
    super(StepEnum.Basics);
  }

  setListeners(): void {
    $('[data-filepick]').on('click', function () {
      const pick = $(this).data('filepick');
      openFilePicker(pick);
    });
  }

  setSourceData(): void {
    /*TBD*/
  }

  renderData(): void {
    /*TBD*/
  }

  getErrors(): DataError[] {
    const errors: DataError[] = [];
    if (!$('#actor_name').val()) {
      errors.push(this.error('HCT.Basics.NoName'));
    }
    return errors;
  }

  saveActorData(newActor: HeroData): void {
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
    };
  }
}
const BasicsTab: Step = new _Basics();
export default BasicsTab;

function openFilePicker(input: string) {
  const path1 = '/';
  const fp2 = new FilePicker({
    type: 'image',
    current: path1,
    callback: (path: string) => {
      $(`#${input}_path`).val(path);
      $(`#${input}_img`).attr('src', path);
    },
  } as any);
  fp2.browse();
}

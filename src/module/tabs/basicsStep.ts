/*
  Functions used exclusively on the Basics tab
*/
import * as Constants from '../constants';
import { Step, StepEnum } from '../Step';
import { TextInputHeroOption } from '../HeroOption';

class _Basics extends Step {
  constructor() {
    super(StepEnum.Basics);
  }

  section = () => $('#basicsDiv');

  avatarOption!: TextInputHeroOption;
  tokenOption!: TextInputHeroOption;

  setListeners(): void {
    $('[data-filepick]', this.section()).on('click', (event) => {
      const pick = $(event.target).data('filepick');
      this.openFilePicker(pick);
    });
  }

  setSourceData(): void {
    /* IMPLEMENT AS NEEDED */
  }

  renderData(): void {
    //this.clearOptions();
    const nameOption = new TextInputHeroOption(
      this.step,
      'name',
      game.i18n.localize('HCT.Basics.CharName'),
      '',
      'HCT.Race.ReviewName',
    );
    nameOption.render($('[data-hero_name]', this.section()));

    this.avatarOption = new TextInputHeroOption(
      this.step,
      'img',
      Constants.MYSTERY_MAN,
      Constants.MYSTERY_MAN,
      'HCT.Race.ReviewAvatar',
    );
    this.avatarOption.render($('[data-hero_avatar]', this.section()));

    this.tokenOption = new TextInputHeroOption(
      this.step,
      'token.img',
      Constants.MYSTERY_MAN,
      Constants.MYSTERY_MAN,
      'HCT.Race.ReviewToken',
    );
    this.tokenOption.render($('[data-hero_token]', this.section()));

    this.stepOptions.push(nameOption, this.avatarOption, this.tokenOption);
  }

  openFilePicker(input: string) {
    const path1 = '/';
    const $input = input == 'avatar' ? this.avatarOption.$elem : this.tokenOption.$elem;
    const $img = $(`#${input}_img`);
    const fp2 = new FilePicker({
      type: 'image',
      current: path1,
      callback: (path: string) => {
        $input.val(path);
        $img.attr('src', path);
      },
    } as any);
    fp2.browse();
  }
}
const BasicsTab: Step = new _Basics();
export default BasicsTab;

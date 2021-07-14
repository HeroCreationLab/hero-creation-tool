/*
  Functions used exclusively on the Basics tab
*/
import * as Constants from '../constants';
import { Step, StepEnum } from '../Step';
import TextInputOption from '../options/TextInputOption';
import Settings from '../settings';

const enum ImgType {
  AVATAR = 'avatar',
  TOKEN = 'token',
}

type TokenizerResponse = {
  avatarFilename: string;
  tokenFilename: string;
};

class _Basics extends Step {
  constructor() {
    super(StepEnum.Basics);
  }

  section = () => $('#basicsDiv');

  avatarOption!: TextInputOption;
  tokenOption!: TextInputOption;
  nameOption!: TextInputOption;

  useTokenizer!: boolean;

  fileChangedCallback(type: ImgType, path: string): void {
    const $input = type === ImgType.AVATAR ? this.avatarOption.$elem : this.tokenOption.$elem;
    const $img = $(`[data-img=${type}]`);

    $input.val(path);
    $img.attr('src', path);
  }

  setListeners(): void {
    $('[data-filepick]', this.section()).on('click', (event) => {
      const pick = $(event.target).data('filepick');

      if (this.useTokenizer && !event.shiftKey) {
        const module = game.modules.get('vtta-tokenizer');

        if (!module) {
          ui.notifications?.warn(game.i18n.localize('HCT.Integration.Tokenizer.Error.ModuleNotFound'));
          this.openFilePicker(pick);
          return;
        }
        if (!module.active) {
          ui.notifications?.warn(game.i18n.localize('HCT.Integration.Tokenizer.Error.ModuleInactive'));
          this.openFilePicker(pick);
          return;
        }
        const tokenizerVersion = module?.data.version;
        if (!tokenizerVersion) {
          ui.notifications?.error(game.i18n.localize('HCT.Integration.Tokenizer.Error.VersionUnobtainable'));
          this.openFilePicker(pick);
          return;
        }
        const lastUnsupportedVersion = Constants.INTEGRATION.TOKENIZER.VERSION;
        // search for newer than last unsupported version
        if (!isNewerVersion(tokenizerVersion, lastUnsupportedVersion)) {
          ui.notifications?.error(
            game.i18n.format('HCT.Integration.Tokenizer.Error.VersionIncompatible', {
              version: lastUnsupportedVersion,
            }),
          );
          this.openFilePicker(pick);
          return;
        }
        if (!this.nameOption.value()) {
          ui.notifications?.error(game.i18n.localize('HCT.Integration.Tokenizer.NeedActorName'));
          return;
        }
        const tokenizerOptions = {
          name: this.nameOption.value(),
          type: 'pc',
        };
        (window as any).Tokenizer.launch(tokenizerOptions, (response: TokenizerResponse) => {
          this.fileChangedCallback(ImgType.AVATAR, response.avatarFilename);
          this.fileChangedCallback(ImgType.TOKEN, response.tokenFilename);
        });
        return;
      }
      this.openFilePicker(pick);
    });
  }

  setSourceData(): void {
    this.useTokenizer = game.settings.get(Constants.MODULE_NAME, Settings.USE_TOKENIZER) as boolean;
  }

  renderData(): void {
    this.clearOptions();
    this.nameOption = new TextInputOption(this.step, 'name', game.i18n.localize('HCT.Basics.CharName'), '');
    this.nameOption.render($('[data-hero_name]', this.section()));

    this.avatarOption = new TextInputOption(this.step, 'img', Constants.MYSTERY_MAN, Constants.MYSTERY_MAN);
    this.avatarOption.render($('[data-hero_avatar]', this.section()));

    this.tokenOption = new TextInputOption(this.step, 'token.img', Constants.MYSTERY_MAN, Constants.MYSTERY_MAN);
    this.tokenOption.render($('[data-hero_token]', this.section()));

    this.stepOptions.push(this.nameOption, this.avatarOption, this.tokenOption);

    $('[data-tokenizer-warning]').toggle(this.useTokenizer);
  }

  openFilePicker(input: string) {
    const path1 = '/';
    const type: ImgType = input === 'avatar' ? ImgType.AVATAR : ImgType.TOKEN;
    const fp2 = new FilePicker({
      type: 'image',
      current: path1,
      callback: (path: string) => this.fileChangedCallback(type, path),
    } as any);
    fp2.browse();
  }
}
const BasicsTab: Step = new _Basics();
export default BasicsTab;

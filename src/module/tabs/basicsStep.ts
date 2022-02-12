/*
  Functions used exclusively on the Basics tab
*/
import { Step, StepEnum } from '../step';
import InputOption from '../options/inputOption';
import SettingKeys from '../settings';
import { INTEGRATION, MODULE_ID, MYSTERY_MAN } from '../constants';

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

  avatarOption!: InputOption;
  tokenOption!: InputOption;
  nameOption!: InputOption;

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
        const lastUnsupportedVersion = INTEGRATION.TOKENIZER.VERSION;
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
          avatarFilename: this.avatarOption.value(),
          tokenFilename: this.tokenOption.value(),
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
    this.useTokenizer = game.settings.get(MODULE_ID, SettingKeys.USE_TOKENIZER) as boolean;
  }

  renderData(data: { actorName?: string }): void {
    this.clearOptions();
    this.nameOption = new InputOption(
      this.step,
      'name',
      game.i18n.localize('HCT.Common.RequiredName'),
      data?.actorName ?? '',
    );
    this.nameOption.render($('[data-hero_name] div', this.section()));

    this.avatarOption = new InputOption(this.step, 'img', MYSTERY_MAN, MYSTERY_MAN);
    this.avatarOption.render($('[data-hero_avatar] div', this.section()));

    this.tokenOption = new InputOption(this.step, 'token.img', MYSTERY_MAN, MYSTERY_MAN);
    this.tokenOption.render($('[data-hero_token] div', this.section()));

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

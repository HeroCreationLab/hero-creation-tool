import '@league-of-foundry-developers/foundry-vtt-types';

declare global {
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }

  namespace ClientSettings {
    interface Values {
      'hero-creation-tool.displayBarsMode': foundry.CONST.TOKEN_DISPLAY_MODES;
      'hero-creation-tool.displayNameMode': foundry.CONST.TOKEN_DISPLAY_MODES;
    }
  }
}
export {};

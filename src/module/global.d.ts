declare global {
  interface LenientGlobalVariableTypes {
    game: never; // the type doesn't matter
  }

  namespace ClientSettings {
    interface Values {
      'hero-creation-tool.displayBarsMode': foundry.CONST.TokenDisplayMode;
      'hero-creation-tool.displayNameMode': foundry.CONST.TokenDisplayMode;
    }
  }
}
export {};

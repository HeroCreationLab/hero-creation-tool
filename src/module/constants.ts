// Class for general global variables.

export const MODULE_NAME = 'hero-creation-tool';
export const MODULE_PATH = 'modules/hero-creation-tool';

export const LOG_PREFIX = 'Hero Creation Tool';
export const MYSTERY_MAN = 'icons/svg/mystery-man.svg';

export const enum DEFAULT_PACKS {
  RACES = 'dnd5e.races',
  RACE_FEATURES = 'dnd5e.races',
  CLASSES = 'dnd5e.classes',
  CLASS_FEATURES = 'dnd5e.classfeatures',
  ITEMS = 'dnd5e.items',
  RULES = 'dnd5e.rules',
}

export const INTEGRATION = {
  TOKENIZER: {
    VERSION: '3.3.0',
  },
};

export const MERGE_OPTIONS = {
  insertKeys: true,
  insertValues: true,
  overwrite: true,
  recursive: true,
  inplace: false,
};

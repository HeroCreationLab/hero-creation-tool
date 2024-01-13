import { SourceType, Sources } from '../settings';

// FIXME make these functions pure

export function addBackgroundFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.BACKGROUNDS].includes(packName)) {
    fieldsToIndex.add('name');
  }
}

export function addClassFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.CLASSES].includes(packName)) {
    fieldsToIndex.add('system.advancement');
    fieldsToIndex.add('system.description.value'); // for sidebar
    fieldsToIndex.add('system.identifier');
    fieldsToIndex.add('system.hitDice');
    fieldsToIndex.add('system.saves');
    fieldsToIndex.add('system.skills');
    fieldsToIndex.add('system.spellcasting');
  }
}

export function addEquipmentFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.ITEMS].includes(packName)) {
    fieldsToIndex.add('system.price');
    fieldsToIndex.add('system.rarity');
    fieldsToIndex.add('system.quantity');
    //fieldsToIndex.add('system.description'); maybe description to find Spellcasting Foci ?
  }
}

export function addFeatFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.FEATS].includes(packName)) {
    fieldsToIndex.add('system.requirements'); // TODO if feat has a requirement show it.
  }
}

export function addRaceFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.RACES].includes(packName)) {
    fieldsToIndex.add('system.advancement');
    fieldsToIndex.add('system.requirements'); // for figuring subraces
    fieldsToIndex.add('system.description.value'); // for sidebar
  }
}

export function addRacialFeaturesFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.RACIAL_FEATURES].includes(packName)) {
    fieldsToIndex.add('system.requirements'); // for mapping racial features to races/subraces
  }
}

export function addSpellFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.SPELLS].includes(packName)) {
    fieldsToIndex.add('system.level');
  }
}

export function addSubclassFields(fieldsToIndex: Set<string>, source: Sources, packName: string) {
  if (source[SourceType.SUBCLASSES].includes(packName)) {
    fieldsToIndex.add('system.advancement');
    fieldsToIndex.add('system.description.value'); // for sidebar
    fieldsToIndex.add('system.identifier');
    fieldsToIndex.add('system.classIdentifier');
    fieldsToIndex.add('system.spellcasting.ability');
    fieldsToIndex.add('system.spellcasting.progression');
  }
}

export enum Tool {
  Artisan = 'art',
  DisguiseKit = 'disg',
  ForgeryKit = 'forg',
  GamingSet = 'game',
  HerbalismKit = 'herb',
  MusicalInstrument = 'music',
  NavigatorsTools = 'navg',
  PoisonersKit = 'pois',
  ThievesTools = 'thief',
  Vehicle = 'vehicle',
}

export const ToolLabel: { [key in Tool]: string } = {
  [Tool.Artisan]: 'DND5E.ToolArtisans',
  [Tool.DisguiseKit]: 'DND5E.ToolDisguiseKit',
  [Tool.ForgeryKit]: 'DND5E.ToolForgeryKit',
  [Tool.GamingSet]: 'DND5E.ToolGamingSet',
  [Tool.HerbalismKit]: 'DND5E.ToolHerbalismKit',
  [Tool.MusicalInstrument]: 'DND5E.ToolMusicalInstrument',
  [Tool.NavigatorsTools]: 'DND5E.ToolNavigators',
  [Tool.PoisonersKit]: 'DND5E.ToolPoisonersKit',
  [Tool.ThievesTools]: 'DND5E.ToolThieves',
  [Tool.Vehicle]: 'DND5E.ToolVehicle',
};

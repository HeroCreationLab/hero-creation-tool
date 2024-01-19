export function getGame(): DnD5eGame {
  if (!(game instanceof Game)) {
    throw new Error('game is not initialized yet!');
  }
  return game as DnD5eGame;
}

interface DnD5eGame extends Game {
  dnd5e: {
    advancement: {
      types: {
        [key: string]: any;
      };
    };
    user: {
      role: any;
    };
    config: {
      currencies: {
        [id: string]: { conversion: number };
      };
      actorSizes: typeof DND5E.SIZES;
    };
  };
}

export const DND5E = {
  SIZES: {
    grg: 'Gargantuan',
    huge: 'Huge',
    lg: 'Large',
    med: 'Medium',
    sm: 'Small',
    tiny: 'Tiny',
  } as const,
};

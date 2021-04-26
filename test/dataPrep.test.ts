import * as DataPrep from '../src/module/dataPrep';
import game from '@league-of-foundry-developers/foundry-vtt-types';

jest.mock('game');
const mockedGame = game as jest.Mocked<typeof game>;

test('DataPrep doesnt crash <3', () => {
  // GIVEN
  const resp = { data: 1 };
  mockedGame.get.mockResolvedValue(resp);

  // WHEN
  const langs = DataPrep.returnLanguages();

  // THEN
  expect(langs).toBe(3);
});

import * as DataPrep from './dataPrep';
import "../../__mocks__/game";
const mergeObject = require("./helpers");

(globalThis as any).mergeObject = mergeObject;

describe('DataPrep', () => {
  test('returns correct Class list', async () => {
    const classes = await DataPrep.setupClasses();
    expect(classes).toMatchSnapshot();
  });
  test('returns correct Race list', async () => {
    const races = await DataPrep.setupRaces();
    expect(races).toMatchSnapshot();
  });
});

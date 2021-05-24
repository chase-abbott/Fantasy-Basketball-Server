
import { getPlayers, mungePlayers } from '../utils/munge-functions.js';

describe('Test munge functions', () => {
  test('Gets players from API', async () => {
    const players = await getPlayers();
    const expected = mungePlayers(players);
    expect(expected[0]).toBe(0);
  });


});
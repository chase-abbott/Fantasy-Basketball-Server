
import { getPlayers, getNews, mungePlayers, mungeNews } from '../utils/munge-functions.js';

describe('Test munge functions', () => {
  test.skip('Gets players from API', async () => {
    const players = await getPlayers();
    const expected = mungePlayers(players);
    expect(expected[0]).toBe(0);
  });

  test('Gets news from API', async () => {
    const players = await getNews();
    const expected = mungeNews(players);
    expect(expected[0]).toBe(0);
  });


});
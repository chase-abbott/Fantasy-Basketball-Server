
import { getPlayers, getNews, mungePlayers, mungeNews, getScores, mungeScores } from '../utils/munge-functions.js';

describe('Test munge functions', () => {
  test.skip('Gets players from API', async () => {
    const players = await getPlayers();
    const expected = mungePlayers(players);
    expect(expected[0]).toBe(0);
  });

  test.skip('Gets news from API', async () => {
    const players = await getNews();
    const expected = mungeNews(players);
    expect(expected[0]).toBe(0);
  });

  test.skip('Gets scores from API', async () => {
    const scores = await getScores();
    const expected = mungeScores(scores);
    expect(expected[0]).toBe(0);
  });


});
import teamIds from '../data/teamIds.js';

export function formatPlayers(data) {
  const mungedArray = data.api.players.map((player) => {
    const matchingPlayer = teamIds.find(id => id === Number(player.teamId));
    if (matchingPlayer !== undefined && Number(player.yearsPro) !== 0) return player;
  });
  return mungedArray.filter(player => {
    return player !== undefined;
  });
}
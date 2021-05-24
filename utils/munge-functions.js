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

// A point will be worth one point, naturally. Rebounds will be worth 1.2 points, and assists will be worth 1.5. You'll get three points for every steal and for every blocked shot, and you'll be docked one point for every turnover.
export function mungePlayerData(data){
 
  const playerGames = data.api.statistics.slice(-100);

  const playerPoints = playerGames.reduce((accumulator, currentValue) => {
    return accumulator += Number(currentValue.points);
  }, 0);
  
  const playerRebounds = playerGames.reduce((accumulator, currentValue) => {
    return accumulator += (Number(currentValue.totReb) * 1.2);
  }, 0);
  
  const playerAssists = playerGames.reduce((accumulator, currentValue) => {
    return accumulator += (Number(currentValue.assists) * 1.5);
  }, 0);
  
  const playerBlocks = playerGames.reduce((accumulator, currentValue) => {
    return accumulator += (Number(currentValue.blocks) * 3);
  }, 0);
  
  const playerSteals = playerGames.reduce((accumulator, currentValue) => {
    return accumulator += (Number(currentValue.steals) * 3);
  }, 0);

  const playerTurnovers = playerGames.reduce((accumulator, currentValue) => {
    return accumulator += (Number(currentValue.turnovers));
  }, 0);

  return Math.floor(((playerPoints + playerRebounds + playerAssists + playerBlocks + playerSteals - playerTurnovers) / 100));
}
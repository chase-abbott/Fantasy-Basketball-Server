import teamIds from '../data/teamIds.js';
import request from 'superagent';
import dotenv from 'dotenv';
dotenv.config();

export async function getActivePlayers() {
  const apiPlayers = await request
    .get('https://api-nba-v1.p.rapidapi.com/players/league/standard')
    .set('x-rapidapi-key', process.env.API_KEY);
  const activePlayers = formatPlayers(apiPlayers.body);
  return activePlayers;
}

// export async function seedPlayers() {
//   const players = await getActivePlayers();
//   // const apiPlayer = await request
//   //   .get('https://api-nba-v1.p.rapidapi.com/statistics/players/playerId/2')
//   //   .set('x-rapidapi-key', process.env.API_KEY);
//   console.log(players);
// }
const players = getActivePlayers();

export async function playerStats() {
  let stats = await Promise.all(
    players.map(async player => {
      // const apiPlayer = 
      const response = await request
        .get(`https://api-nba-v1.p.rapidapi.com/statistics/players/playerId/${player.playerId}`)
        .set('x-rapidapi-key', process.env.API_KEY);
      return response.body.api.statistics;
    })
  );
  console.log(playerStats(stats));
}
//   Promise.all(arr).then(completed =>
//   {
//     console.log(completed);
//   });
  

// const fantasyPoints = mungePlayerData(apiPlayer.body);
// return {
//   height: player.heightInMeters,
//   weight: player.weightInKilograms,
//   jersey: player.leagues.standard.jersey,
//   playerId: player.playerId,
//   name: player.firstName + ' ' + player.lastName,
//   position: player.leagues.position,
//   fantasyPoint: fantasyPoints
// };


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
  console.log(data);
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


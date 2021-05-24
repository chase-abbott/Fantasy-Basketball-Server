
import request from 'superagent';
import dotenv from 'dotenv';
dotenv.config();

export async function getPlayers(){
  const response = await request
    .get('https://fly.sportsdata.io/v3/nba/projections/json/PlayerSeasonProjectionStats/2021')
    .set('Ocp-Apim-Subscription-Key', process.env.SPORTSDATA_KEY);
  return response.body;
}

export function mungePlayers(players) {
  const mungedPlayers = players.map(player => {
    if(player.FantasyPointsYahoo){
      return {
        playerId: player.PlayerID,
        name: player.Name,
        position: player.Position,
        fantasyPoints: Math.floor(player.FantasyPointsYahoo / player.Games)
      };
    } else {
      return {
        playerId: player.PlayerID,
        name: player.Name,
        position: player.Position,
        fantasyPoints: 0
      };
    }
  });
  return mungedPlayers;
}

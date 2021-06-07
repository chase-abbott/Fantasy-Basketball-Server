
import request from 'superagent';
import dotenv from 'dotenv';
dotenv.config();

export async function getPlayers(){
  const { body } = await request
    .get('https://fly.sportsdata.io/v3/nba/projections/json/PlayerSeasonProjectionStats/2021')
    .set('Ocp-Apim-Subscription-Key', process.env.SPORTSDATA_KEY);
  return body;
}

// this is unit testable!
export function formatDate(date) {
  // a bit simpler way to do this:
  const [mmm, dd, yyyy]  = date
    .toDateString() // returns "Wed Jul 28 1993"
    .split(' ') // ["Wed", "Jul", "28", "1993"]
    .slice(1); // ["Jul", "28", "1993"]

  return `${yyyy}-${mmm.toUpperCase()}-${dd.padStart(2, '0')}`;
}

export async function getScores() {
  const today = formatDate(new Date());

  const { body } = await request
    .get(`https://fly.sportsdata.io/v3/nba/scores/json/GamesByDate/${today}`)
    .set('Ocp-Apim-Subscription-Key', process.env.SPORTSDATA_KEY);
  
  return body;
}

export function mungeScores(scores) {
  return scores.map(score => { {
    return {
      id: score.GameID,
      isOver: score.IsClosed,
      status: score.Status,
      awayTeam: score.AwayTeam,
      homeTeam: score.HomeTeam,
      awayScore: score.AwayTeamScore,
      homeScore: score.HomeTeamScore,
      quarter: score.Quarter,
      minutes: score.TimeRemainingMinutes,
      seconds: score.TimeRemainingSeconds,
      spread: score.PointSpread,
      overUnder: score.OverUnder
    };
  }
  });
}

export async function getVids() {
  const { body } = await request
    .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.YOUTUBE_KEY}&type=video&videoEmbeddable=true&videoSyndicated=true&videoLicense=any&q=nba&maxResults=3`);
  
    return body;
}

export async function getNews() {
  const { body } = await request
    .get('https://fly.sportsdata.io/v3/nba/scores/json/News')
    .set('Ocp-Apim-Subscription-Key', process.env.SPORTSDATA_KEY);

  return body;
}

export function mungeVids(videos) {
  return videos.items.map(video => {
    return {
      video: video.id.videoId,
      id: video.etag
    };
  });
}

export function mungeNews(news) {
  return news.map(player => {
    return { 
      news: player.Content 
    };
  });
}

export function mungePlayers(players) {
  const mungedPlayers = players.map(player => {
    // only put the smallest part that is different in the conditional.
    // and in this case, 0 divided by anything in JS is 0
    // (I'm assuming here that player.Games always has a value, but could be 0 so that's the condition
    // because 0/0 is Infinity in JS)
    return {
      playerId: player.PlayerID,
      name: player.Name,
      position: player.Position,
      fantasyPoints: player.Games 
        ? Math.floor((player.FantasyPointsYahoo || 0) / player.Games) 
        : 0
    };

  });

  return mungedPlayers;
}

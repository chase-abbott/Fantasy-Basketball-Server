
import request from 'superagent';
import dotenv from 'dotenv';
dotenv.config();

export async function getPlayers(){
  const response = await request
    .get('https://fly.sportsdata.io/v3/nba/projections/json/PlayerSeasonProjectionStats/2021')
    .set('Ocp-Apim-Subscription-Key', process.env.SPORTSDATA_KEY);
  return response.body;
}

export async function getScores() {
  let today = new Date();
  let dd = String(today.getDate()).padStart(2, '0');
  let mm;
  switch (String(today.getMonth()) {
    case '0':
      mm = 'JAN';
      break;
    case '1':
      mm = 'FEB';
      break;
    case '2':
      mm = 'MAR';
      break;
    case '3':
      mm = 'APR';
      break;
    case '4':
      mm = 'MAY';
      break;
    case '5':
      mm = 'JUN';
      break;
    case '6':
      mm = 'JUL';
      break;
    case '7':
      mm = 'AUG';
      break;
    case '8':
      mm = 'SEP';
      break;
    case '9':
      mm = 'OCT';
      break;
    case '10':
      mm = 'NOV';
      break;
    case '11':
      mm = 'DEC';
      break;
  }

  let yyyy = today.getFullYear();

  today = yyyy + '-' + mm + '-' + dd;
  const response = await request
    .get(`https://fly.sportsdata.io/v3/nba/scores/json/GamesByDate/${today}`)
    .set('Ocp-Apim-Subscription-Key', process.env.SPORTSDATA_KEY);
  return response.body;
}

export function mungeScores(scores) {
  const mungedScores = scores.map(score => { {
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
  return mungedScores;
}

export async function getVids() {
  const response = await request
    .get(`https://www.googleapis.com/youtube/v3/search?part=snippet&key=${process.env.YOUTUBE_KEY}&type=video&videoEmbeddable=true&videoSyndicated=true&videoLicense=any&q=nba&maxResults=3`);
  return response.body;
}

export async function getNews() {
  const response = await request
    .get('https://fly.sportsdata.io/v3/nba/scores/json/News')
    .set('Ocp-Apim-Subscription-Key', process.env.SPORTSDATA_KEY);

  return response.body;
}

export function mungeVids(videos) {
  const mungedVids = videos.items.map(video => { {
    return {
      video: video.id.videoId,
      id: video.etag
    };
  }
  });
  return mungedVids;
}

export function mungeNews(news) {
  const mungedNews = news.map(player => { {
    return {
      news: player.Content
    };
  }
  });
  return mungedNews;
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

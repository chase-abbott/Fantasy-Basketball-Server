/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';

import { getPlayers, getNews, mungeNews, mungePlayers, getScores, mungeScores } from '../utils/munge-functions.js';
//comment

// make an express app
const app = express();

// allow our server to be called from any website
app.use(cors());
// read JSON from body of request when indicated by Content-Type
app.use(express.json());
// enhanced logging
app.use(morgan('dev'));

const authRoutes = createAuthRoutes();

// setup authentication routes to give user an auth token
// creates a /api/auth/signin and a /api/auth/signup POST route. 
// each requires a POST body with a .email and a .password and .name
app.use('/api/auth', authRoutes);

app.get('/', async (req, res) => {
  res.send('Basketball API');
});

// everything that starts with "/api" below here requires an auth token!
// In theory, you could move "public" routes above this line
app.use('/api', ensureAuth);

// API routes:
app.get('/api/players', async (req, res) => {
  // use SQL query to get data...
  try {
    const players = await getPlayers();
    const mungedPlayers = mungePlayers(players);

    // send back the data
    res.json(mungedPlayers);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/news', async (req, res) => {
  // use SQL query to get data...
  try {
    const news = await getNews();
    const mungedNews = mungeNews(news);


    // send back the data
    res.json(mungedNews);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/scores', async (req, res) => {
  // use SQL query to get data...
  try {
    const scores = await getScores();
    const mungedScores = mungeScores(scores);

    console.log(mungedScores);
    // send back the data
    res.json(mungedScores);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/me/players', async (req, res) => {
  try {
    const data = await client.query(`
    SELECT id, player_id as "playerId", name, position, fantasy_points as "fantasyPoints", user_id as "userId"
    FROM userPlayers
    WHERE user_id = $1;`
    , [req.userId]);
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });

  }
});

app.post('/api/me/players', async (req, res) => {
  try {
    const player = req.body;
    const data = await client.query(`
    INSERT INTO userPlayers (player_id, name, position, fantasy_points, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, player_id as "playerId", name, position, fantasy_points as "fantasyPoints", user_id as "userId";
    `, [player.playerId, player.name, player.position, player.fantasyPoints, req.userId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.get('/api/me/team', async (req, res) => {
  try {
    const data = await client.query(`
    SELECT id, team, starting_five as "startingFive", bench, user_id as "userId"
    FROM userTeams
    WHERE user_id = $1`, [req.userId]);
    res.json(data.rows);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.post('/api/me/team', async (req, res) => {
  try {
    const team = req.body;
    const data = await client.query(`
    INSERT INTO userTeams (team, starting_five, bench, user_id)
    VALUES ($1, $2, $3, $4)
     RETURNING id, team, starting_five as "startingFive", bench, user_id as "userId";
    `, [team.team.data, team.startingFive.data, team.bench.data, req.userId]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

app.put('/api/me/team/:id', async (req, res) => {
  try {
    const team = req.body;
    const data = await client.query(`
    UPDATE userTeams
    SET team = $1,
        starting_five = $2,
        bench = $3
    WHERE user_id = $4
    and id = $5
    RETURNING id, team, starting_five as "startingFive", bench, user_id as "userId";`
    , [team.team, team.startingFive, team.bench, team.id, req.params.id]);

    res.json(data.rows[0]);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});

export default app;
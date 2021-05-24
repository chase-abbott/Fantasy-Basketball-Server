/* eslint-disable no-console */
// import dependencies
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import client from './client.js';
import ensureAuth from './auth/ensure-auth.js';
import createAuthRoutes from './auth/create-auth-routes.js';

import { getPlayers, mungePlayers } from '../utils/munge-functions.js';


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

// heartbeat route

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
  catch(err) {
    console.log(err);
    res.status(500).json({ error: err.message });  
  }
});

app.post('/api/me/players', async (req, res) => {
  const player = req.body;
  try{
    const data = await client.query(`
    INSERT INTO userPlayers (player_id, name, position, fantasy_points, user_id)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING id, player_id as "playerId", name, position, fantasy_points as "fantasyPoints", user_id as "userId";
    `, [player.playerId, player.name, player.position, player.fantasyPoints, req.userId]);

    res.json(data.rows[0]);
  }
  catch(err){
    console.log(err);
    res.status(500).json({ error: err.message });
  }
});


export default app;
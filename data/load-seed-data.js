/* eslint-disable no-console */
import client from '../lib/client.js';
// import our seed data:
import users from './users.js';
import players from './players.js';

run();

async function run() {

  try {

    await Promise.all(
      users.map(user => {
        return client.query(`
          INSERT INTO users (name, email, hash)
          VALUES ($1, $2, $3)
          RETURNING *;
        `,
        [user.name, user.email, user.password]);
      })
    );
    
    // const user = data[0].rows[0];

    await Promise.all(
      players.map(player => {
        return client.query(`
        INSERT INTO allPlayers (player_id, height, weight, jersey, name, position, fantasy_points)
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        `,
        [player.playerId, player.heightInMeters, player.weightInKilograms, player.leagues.standard.jersey, player.name, player.position, player.fantasyPoints]);
      })
    );
    

    console.log('seed data load complete');
  }
  catch(err) {
    console.log(err);
  }
  finally {
    client.end();
  }
    
}
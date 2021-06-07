/* eslint-disable no-console */
import client from '../lib/client.js';

// async/await needs to run in a function
run();

async function run() {

  try {

    // run a query to create tables
    await client.query(` 
      CREATE TABLE users (
        id SERIAL PRIMARY KEY NOT NULL,
        name VARCHAR(512) NOT NULL,
        email VARCHAR(512) NOT NULL,
        hash VARCHAR(512) NOT NULL
      );
    
      CREATE TABLE user_players ( -- snake_case for SQL schemas
        id SERIAL PRIMARY KEY NOT NULL,
        player_id INTEGER NOT NULL,
        name VARCHAR(512) NOT NULL,
        position VARCHAR(128) NOT NULL,
        fantasy_points FLOAT NOT NULL,
        user_id INTEGER NOT NULL REFERENCES users(id)
      );

      CREATE TABLE user_teams (
        id SERIAL PRIMARY KEY NOT NULL,
        team JSON[] NOT NULL, -- don't hide date with serialization
        starting_five JSON[] NOT NULL,
        bench JSON[] NOT NULL, -- don't hide date with serialization
        user_id INTEGER NOT NULL REFERENCES users(id)
      )
    `);

    console.log('create tables complete');
  }
  catch (err) {
    // problem? let's see the error...
    console.log(err);
  }
  finally {
    // success or failure, need to close the db connection
    client.end();
  }

}
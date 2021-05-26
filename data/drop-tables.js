/* eslint-disable no-console */
import client from '../lib/client.js';

run();

async function run() {

  try {

    await client.query(`
      DROP TABLE IF EXISTS users CASCADE;
      DROP TABLE IF EXISTS userPlayers CASCADE
      DROP TABLE IF EXISTS userTeams;
    `);

    console.log('drop tables complete');
  }
  catch (err) {
    console.log(err);
  }
  finally {
    client.end();
  }

}
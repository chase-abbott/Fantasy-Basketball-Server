import client from '../lib/client.js';
import supertest from 'supertest';
import app from '../lib/app.js';
import { execSync } from 'child_process';

const request = supertest(app);

describe('API Routes', () => {

  afterAll(async () => {
    return client.end();
  });

  describe('/api/players', () => {
    let user;

    beforeAll(async () => {
      execSync('npm run recreate-tables');

      const response = await request
        .post('/api/auth/signup')
        .send({
          name: 'Me the User',
          email: 'me@user.com',
          password: 'password'
        });

      expect(response.status).toBe(200);

      user = response.body;
    });

    // append the token to your requests:
    //  .set('Authorization', user.token);
    
    it('GET to /api/players to grab players from API and munge', async () => {
      
      // remove this line, here to not have lint error:
      const response = await request
        .get('/api/players')
        .set('Authorization', user.token);
  
      expect(response.status).toBe(200);
    });

    it('POST to /api/me/players to put a player in a users team', async () => {
      const newPlayer = {
        id: expect.any(Number),
        name: 'Lebron James',
        playerId: 100,
        position: 'Small Forward',
        fantasyPoints: 100,
        userId: user.id
      };
      const response = await request
        .get('api/me/players')
        .set('Authorization', user.token)
        .send(newPlayer);

      expect(response.status).toBe(200);
      expect(response.body).toBe(newPlayer);
    });

  });
});
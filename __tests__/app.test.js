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

    const newPlayer = {
      id: expect.any(Number),
      name: 'Lebron James',
      playerId: 100,
      position: 'Small Forward',
      fantasyPoints: 100,
    };

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
      newPlayer.userId = user.id;

      const response = await request
        .post('/api/me/players')
        .set('Authorization', user.token)
        .send(newPlayer);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(newPlayer);
    });

    it('GET /api/me/players', async () => {
      const response = await request
        .get('/api/me/players')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([newPlayer]);
    });

    it('DELETE /api/me/players/:id should delete all players associated w/ user', async () => {
      let anotherPlayer = {
        'playerId': 20000452,
        'name': 'Garrett Temple',
        'position': 'SG',
        'fantasyPoints': 23
      };
      anotherPlayer.userId = user.id;

      const post = await request
        .post('/api/me/players')
        .set('Authorization', user.token)
        .send(anotherPlayer);

      expect(post.status).toBe(200);
      anotherPlayer = post.body;

      const myGet = await request
        .get('/api/me/players')
        .set('Authorization', user.token);

      expect(myGet.body).toStrictEqual([newPlayer, anotherPlayer]);

      const response = await request
        .delete(`/api/me/players/${user.id}`)
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body).toEqual([newPlayer, anotherPlayer]);


      const mySecondGet = await request
        .get('/api/me/players')
        .set('Authorization', user.token);

      expect(mySecondGet.body).toStrictEqual([]);
    });

  });
});


describe.skip('UserTeams Routes', () => {

  afterAll(async () => {
    return client.end();
  });
  describe.skip('Routes', () => {
    let user;
    let newTeam;

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

    newTeam = {
      id: expect.any(Number),
      team: {
        data: [{
          'playerId': 20000452,
          'name': 'Garrett Temple',
          'position': 'SG',
          'fantasyPoints': 23
        },
        {
          'playerId': 20000453,
          'name': 'Terrence Ross',
          'position': 'SG',
          'fantasyPoints': 37
        },
        {
          'playerId': 20000455,
          'name': 'Jonas Valanciunas',
          'position': 'C',
          'fantasyPoints': 52
        },
        {
          'playerId': 20000456,
          'name': 'DeMar DeRozan',
          'position': 'SG',
          'fantasyPoints': 61
        },
        {
          'playerId': 20000457,
          'name': 'Kyle Lowry',
          'position': 'PG',
          'fantasyPoints': 57
        },
        {
          'playerId': 20000440,
          'name': 'Marcin Gortat',
          'position': 'C',
          'fantasyPoints': 0
        },
        {
          'playerId': 20000441,
          'name': 'Bradley Beal',
          'position': 'SG',
          'fantasyPoints': 65
        },
        {
          'playerId': 20000442,
          'name': 'John Wall',
          'position': 'PG',
          'fantasyPoints': 57
        },
        {
          'playerId': 20000443,
          'name': 'Otto Porter Jr.',
          'position': 'SF',
          'fantasyPoints': 42
        },
        {
          'playerId': 20000458,
          'name': 'Amir Johnson',
          'position': 'PF',
          'fantasyPoints': 0
        }]
      },
      startingFive: {
        data: [{
          'playerId': 20000440,
          'name': 'Marcin Gortat',
          'position': 'C',
          'fantasyPoints': 0
        },
        {
          'playerId': 20000441,
          'name': 'Bradley Beal',
          'position': 'SG',
          'fantasyPoints': 65
        },
        {
          'playerId': 20000442,
          'name': 'John Wall',
          'position': 'PG',
          'fantasyPoints': 57
        },
        {
          'playerId': 20000443,
          'name': 'Otto Porter Jr.',
          'position': 'SF',
          'fantasyPoints': 42
        },
        {
          'playerId': 20000458,
          'name': 'Amir Johnson',
          'position': 'PF',
          'fantasyPoints': 0
        }]
      },
      bench: {
        data: [
          {
            'playerId': 20000452,
            'name': 'Garrett Temple',
            'position': 'SG',
            'fantasyPoints': 23
          },
          {
            'playerId': 20000453,
            'name': 'Terrence Ross',
            'position': 'SG',
            'fantasyPoints': 37
          },
          {
            'playerId': 20000455,
            'name': 'Jonas Valanciunas',
            'position': 'C',
            'fantasyPoints': 52
          },
          {
            'playerId': 20000456,
            'name': 'DeMar DeRozan',
            'position': 'SG',
            'fantasyPoints': 61
          },
          {
            'playerId': 20000457,
            'name': 'Kyle Lowry',
            'position': 'PG',
            'fantasyPoints': 57
          }]
      }
    };

    it.skip('POST /api/me/team', async () => {
      newTeam.userId = user.id;

      const response = await request
        .post('/api/me/team')
        .set('Authorization', user.token)
        .send(newTeam);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        id: 1,
        team: [
          {
            playerId: 20000452,
            name: 'Garrett Temple',
            position: 'SG',
            fantasyPoints: 23
          },
          {
            playerId: 20000453,
            name: 'Terrence Ross',
            position: 'SG',
            fantasyPoints: 37
          },
          {
            playerId: 20000455,
            name: 'Jonas Valanciunas',
            position: 'C',
            fantasyPoints: 52
          },
          {
            playerId: 20000456,
            name: 'DeMar DeRozan',
            position: 'SG',
            fantasyPoints: 61
          },
          {
            playerId: 20000457,
            name: 'Kyle Lowry',
            position: 'PG',
            fantasyPoints: 57
          },
          {
            playerId: 20000440,
            name: 'Marcin Gortat',
            position: 'C',
            fantasyPoints: 0
          },
          {
            playerId: 20000441,
            name: 'Bradley Beal',
            position: 'SG',
            fantasyPoints: 65
          },
          {
            playerId: 20000442,
            name: 'John Wall',
            position: 'PG',
            fantasyPoints: 57
          },
          {
            playerId: 20000443,
            name: 'Otto Porter Jr.',
            position: 'SF',
            fantasyPoints: 42
          },
          {
            playerId: 20000458,
            name: 'Amir Johnson',
            position: 'PF',
            fantasyPoints: 0
          }
        ],
        startingFive: [
          {
            playerId: 20000440,
            name: 'Marcin Gortat',
            position: 'C',
            fantasyPoints: 0
          },
          {
            playerId: 20000441,
            name: 'Bradley Beal',
            position: 'SG',
            fantasyPoints: 65
          },
          {
            playerId: 20000442,
            name: 'John Wall',
            position: 'PG',
            fantasyPoints: 57
          },
          {
            playerId: 20000443,
            name: 'Otto Porter Jr.',
            position: 'SF',
            fantasyPoints: 42
          },
          {
            playerId: 20000458,
            name: 'Amir Johnson',
            position: 'PF',
            fantasyPoints: 0
          }
        ],
        bench: [
          {
            playerId: 20000452,
            name: 'Garrett Temple',
            position: 'SG',
            fantasyPoints: 23
          },
          {
            playerId: 20000453,
            name: 'Terrence Ross',
            position: 'SG',
            fantasyPoints: 37
          },
          {
            playerId: 20000455,
            name: 'Jonas Valanciunas',
            position: 'C',
            fantasyPoints: 52
          },
          {
            playerId: 20000456,
            name: 'DeMar DeRozan',
            position: 'SG',
            fantasyPoints: 61
          },
          {
            playerId: 20000457,
            name: 'Kyle Lowry',
            position: 'PG',
            fantasyPoints: 57
          }
        ],
        userId: 1
      });
   
      newTeam = response.body;
    });

    it.skip('GET /api/me/team', async () => {
      const response = await request
        .get('/api/me/team')
        .set('Authorization', user.token);

      expect(response.status).toBe(200);
      expect(response.body[0]).toEqual(newTeam);
    });

    it.skip('PUT /api/me/team', async () => {
      newTeam.startingFive = [{
        'playerId': 20000440,
        'name': 'Marcin Gortat',
        'position': 'C',
        'fantasyPoints': 0
      },
      {
        'playerId': 20000452,
        'name': 'Garrett Temple',
        'position': 'SG',
        'fantasyPoints': 23
      },
      {
        'playerId': 20000442,
        'name': 'John Wall',
        'position': 'PG',
        'fantasyPoints': 57
      },
      {
        'playerId': 20000458,
        'name': 'Amir Johnson',
        'position': 'PF',
        'fantasyPoints': 0
      },
      {
        'playerId': 20000443,
        'name': 'Otto Porter Jr.',
        'position': 'SF',
        'fantasyPoints': 42
      },
      ];
      const response = await request
        .put(`/api/me/team/${newTeam.id}`)
        .set('Authorization', user.token)
        .send(newTeam);

      expect(response.status).toBe(200);
      expect(response.body).toStrictEqual(newTeam);
    });
  });
});

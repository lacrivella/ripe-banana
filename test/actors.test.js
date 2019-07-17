require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');

describe('actor routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('post a new actor', () => {
    return request(app)
      .post('/api/v1/actors')
      .send({ name: 'Billy Zane', dob: 'February 24, 1966', pob: 'Chicago' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Billy Zane',
          dob: '1966-02-24T08:00:00.000Z',
          pob: 'Chicago',
          __v: 0
        });
      });
  });
  it('get all actors', async() => {
    const actors = await Actor.create([
      { name: 'Tim Curry' },
      { name: 'Michael McKean' },
      { name: 'Lesley Ann Warren' }
    ]);
    return request(app)
      .get('/api/v1/actors')
      .then(res => {
        const actorsJSON = JSON.parse(JSON.stringify(actors));
        actorsJSON.forEach((actor) => {
          expect(res.body).toContainEqual({ name: actor.name, _id: actor._id });
        });
      });
  });
});

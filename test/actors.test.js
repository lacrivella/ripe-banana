require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Actor = require('../lib/models/Actor');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');

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
  it('get an actor by id', async() => {
    const actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Tilda Swinton',
      dob: 'November 5, 1960',
      pob: 'London'
    })));
    const studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Babelsberg Film Studio',
      address: {
        city: 'Potsdam',
        state: 'Brandenburg',
        country: 'Germany'
      }
    })));
    const film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Grand Budapest Hotel',
      studio: studio._id,
      released: 2014,
      cast: [{ role: 'Madame D', actor: actor._id }]
    })));

    return request(app)
      .get(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: actor._id,
          name: 'Tilda Swinton',
          dob: actor.dob,
          pob: 'London',
          films: [{
            _id: film._id,
            title: film.title,
            released: film.released
          }]
        });
      });
  });
  it('puts an updated actor', async() => {
    const actor = await Actor.create({
      name: 'Bette Davis',
      dob: 'April 5, 1908',
      pob: 'France'
    });
    return request(app)
      .put(`/api/v1/actors/${actor._id}`)
      .send({
        name: 'Ann Baxter',
        dob: 'May 7, 1923',
        pob: 'Michigan City'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Ann Baxter',
          dob: expect.any(String),
          pob: 'Michigan City',
          __v: 0
        });
      });
  });
  it('deletes an actor', async() => {
    const actor = await Actor.create({
      name: 'Winona Ryder',
      dob: 'October 29, 1971',
      pob: 'Winona, MN'
    });
    return request(app)
      .delete(`/api/v1/actors/${actor._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Winona Ryder',
          dob: expect.any(String),
          pob: 'Winona, MN',
          __v: 0
        });
      });
  });
});

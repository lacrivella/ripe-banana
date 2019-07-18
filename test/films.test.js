require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');

describe('film routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let actor = null;
  let studio = null;
  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Gregory Peck',
      dob: new Date('April 5, 1916'),
      pob: 'San Diego, CA'
    })));
    studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Cinecitta',
      address: {
        city: 'Rome',
        state: 'Lazio',
        country: 'Italy'
      }
    })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('creates a new film', () => {
    return request(app)
      .post('/api/v1/films')
      .send({ title: 'Roman Holiday', studio: studio._id, released: 1953, cast: [{ role: 'Joe Bradley', actor: actor._id }] })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          title: 'Roman Holiday',
          studio: studio._id.toString(),
          released: 1953,
          cast: [{
            _id: expect.any(String),
            role: 'Joe Bradley',
            actor: actor._id.toString()
          }],
          __v: 0
        });
      });
  });
});

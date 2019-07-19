require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Actor = require('../lib/models/Actor');

describe('app routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('post a new studio', () => {
    return request(app)
      .post('/api/v1/studios')
      .send({ name: 'MGM' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'MGM',
          __v: 0
        });
      });
  });
  it('get all studios', async() => {
    const studios = await Studio.create([
      { name: 'MGM' },
      { name: 'Paramount' },
      { name: 'Universal' }
    ]);
    return request(app)
      .get('/api/v1/studios')
      .then(res => {
        const studiosJSON = JSON.parse(JSON.stringify(studios));
        studiosJSON.forEach((studio) => {
          expect(res.body).toContainEqual({ name: studio.name, _id: studio._id });
        });
      });
  });
  it('gets a studio by an id updated with film', async() => {
    const studio = await Studio.create({
      name: 'MGM',
      address: { city: 'Beverly Hills', state: 'CA', country: 'USA' }
    });
    const actor = await Actor.create({
      name: 'Diego Luna',
      dob: 'December 29, 1979',
      pob: 'Toluca, Mexico'
    });
    const film = await Film.create({
      title: 'Rogue One',
      studio: studio._id,
      released: 2016,
      cast: [{
        role: 'Cassian Andor',
        actor: actor._id
      }]
    });
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        const filmJSON = JSON.parse(JSON.stringify(film));
        const studioJSON = JSON.parse(JSON.stringify(studio));

        expect(res.body).toEqual({
          _id: expect.any(String),
          name: studioJSON.name,
          address: studioJSON.address,
          films: [{
            _id: filmJSON._id,
            title: filmJSON.title
          }]
        });
      });
  });
  it('deletes a studio', async() => {
    const studio = await Studio.create({
      name: 'Disney'
    });
    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Disney',
          __v: 0
        });
      });
  });
  it('cannot delete if theres a film', async() => {
    const studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Disney'
    })));

    const actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Meryl Streep',
      dob: 'June 22, 1949',
      pob: 'Summit, NJ'
    })));

    const film = JSON.parse(JSON.stringify(await Film.create({
      title: 'the Devil Wears Prada', 
      studio: studio._id, 
      released: 2006, 
      cast: [{ role: 'Miranda Priestly', actor: actor._id }]
    })));

    return request(app)
      .delete(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.status).toEqual(409);
      });
  });
});

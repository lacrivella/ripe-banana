require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Studio = require('../lib/models/Studio');

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
  it('gets a studio by an id', async() => {
    const studio = await Studio.create({
      name: 'MGM',
      address: { city: 'Portland', state: 'OR', country: 'USA' }
    });
    return request(app)
      .get(`/api/v1/studios/${studio._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'MGM',
          address: { city: 'Portland', state: 'OR', country: 'USA' },
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
});

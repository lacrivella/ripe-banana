require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');

describe('reviewer routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  afterAll(() => {
    return mongoose.connection.close();
  });
  it('post a new reviewer', () => {
    return request(app)
      .post('/api/v1/reviewers')
      .send({ name: 'Statler', company: 'Muppet' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Statler',
          company: 'Muppet',
          __v: 0
        });
      });
  });
  it('gets all the reviewers', async() => {
    const reviewers = await Reviewer.create([
      { name: 'Statler', company: 'Muppet' },
      { name: 'Waldorf', company: 'Balconey' },
      { name: 'Judith Crist', company: 'New York Herald' }
    ]);
    return request(app)
      .get('/api/v1/reviewers')
      .then(res => {
        const reviewersJSON = JSON.parse(JSON.stringify(reviewers));
        reviewersJSON.forEach((reviewer) => {
          expect(res.body).toContainEqual({ name: reviewer.name, company: reviewer.company, _id: reviewer._id });
        });
      });
  });
  it('get a reviewer by id', async() => {
    const reviewer = await Reviewer.create({
      name: 'Roger Ebert',
      company: 'Chicago Sun-Times'
    });
    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Roger Ebert',
          company: 'Chicago Sun-Times'
        });
      });
  });
});

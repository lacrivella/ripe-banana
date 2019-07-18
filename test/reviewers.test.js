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
      .send({ name: 'Statler' })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'Statler',
          __v: 0
        });
      });
  });
});
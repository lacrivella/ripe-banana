require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
const Reviewer = require('../lib/models/Reviewer');
const Actor = require('../lib/models/Actor');
const Studio = require('../lib/models/Studio');
const Film = require('../lib/models/Film');
const Review = require('../lib/models/Review');

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
    const reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
      name: 'Roger Ebert',
      company: 'Chicago Sun-Times'
    })));

    const actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Keanu Reeves',
      dob: new Date('September 2, 1964'),
      pob: 'Beirut, Lebanon'
    })));

    const studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Cinecitta',
      address: {
        city: 'Rome',
        state: 'Lazio',
        country: 'Italy'
      }
    })));

    const film = JSON.parse(JSON.stringify(await Film.create({
      title: 'John Wick 3',
      studio: studio._id,
      released: 1962,
      cast: [{ role: 'John Wick', actor: actor._id }]
    })));

    const review = JSON.parse(JSON.stringify(await Review.create({
      rating: 4,
      reviewer: reviewer._id,
      review: 'blah blah',
      film: film._id
    })));

    return request(app)
      .get(`/api/v1/reviewers/${reviewer._id}`)
      .then(res => {
        expect(res.body).toEqual({
          _id: reviewer._id,
          name: 'Roger Ebert',
          company: 'Chicago Sun-Times',
          reviews: [{
            _id: review._id,
            rating: review.rating,
            review: review.review,
            film: {
              _id: film._id,
              title: film.title
            } 
          }]
        });
      });
  });

  it('puts an updated reviewer', async() => {
    const reviewer = await Reviewer.create({
      name: 'Judge Judy',
      company: 'Judgey Court'
    });
    return request(app)
      .put(`/api/v1/reviewers/${reviewer._id}`)
      .send({
        name: 'LA Crivella',
        company: 'Silently Judging You'
      })
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          name: 'LA Crivella',
          company: 'Silently Judging You',
          __v: 0
        });
      });
  });
});

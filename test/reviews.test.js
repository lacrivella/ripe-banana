require('dotenv').config();

const request = require('supertest');
const app = require('../lib/app');
const connect = require('../lib/utils/connect');
const mongoose = require('mongoose');
// const Review = require('../lib/models/Review');
const Film = require('../lib/models/Film');
const Studio = require('../lib/models/Studio');
const Actor = require('../lib/models/Actor');
const Reviewer = require('../lib/models/Reviewer');


describe('review routes', () => {
  beforeAll(() => {
    connect();
  });

  beforeEach(() => {
    return mongoose.connection.dropDatabase();
  });

  let studio = null;
  let actor = null;
  let reviewer = null;
  let film = null;
  beforeEach(async() => {
    actor = JSON.parse(JSON.stringify(await Actor.create({
      name: 'Tom Hardy',
      dob: 'September 15, 1977',
      pob: 'London'
    })));
    studio = JSON.parse(JSON.stringify(await Studio.create({
      name: 'Lionsgate',
      address: { 
        city: 'Santa Monica', 
        state: 'CA', 
        country: 'USA'
      } 
    })));
    film = JSON.parse(JSON.stringify(await Film.create({
      title: 'Tinker, Tailor, Soldier, Spy', 
      studio: studio._id, 
      released: 2011, 
      cast: [{ role: 'Ricki Tarr', actor: actor._id }]
    })));
    reviewer = JSON.parse(JSON.stringify(await Reviewer.create({
      name: 'Judgey McJudge',
      company: 'Oh No They Didnt'
    })));
  });

  afterAll(() => {
    return mongoose.connection.close();
  });

  it('post a new review', () => {
    const reviewMovie = {
      rating: 3,
      reviewer: reviewer._id,
      review: 'blah blah blah',
      film: film._id,
    }
    return request(app)
      .post('/api/v1/reviews')
      .send(reviewMovie)
      .then(res => {
        expect(res.body).toEqual({
          _id: expect.any(String),
          rating: 3,
          reviewer: reviewer._id,
          review: 'blah blah blah',
          film: film._id,
          __v: 0,
          createdAt: expect.any(String),
          updatedAt: expect.any(String)
        });
      });
  });
});
  
  // rating,
  // reviewer,
  // review,
  //  film
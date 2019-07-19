const { Router } = require('express');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      rating,
      reviewer,
      review,
      film
    } = req.body;

    Review
      .create(({ rating, reviewer, review, film }))
      .then(review => res.send(review))
      .catch(next);
  // })
  // .get('/', (req, res, next) => {
  //   Review
  //     .find()
  //     .select({  })
  //     .then(reviews => res.send(reviews))
  //     .catch(next);
  // })
  // .get('/:id', (req, res, next) => {
  //   Review
  //     .findById(req.params.id)
  //     .select({  })
  //     .then(review => res.send(review))
  //     .catch(next);
  // })
  // .put('/:id', (req, res, next) => {
  //   Review
  //     .findByIdAndUpdate(req.params.id, req.body, { new: true })
  //     .then(updatedReview => res.send(updatedReview))
  //     .catch(next);
  });
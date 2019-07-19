const { Router } = require('express');
const Reviewer = require('../models/Reviewer');
const Review = require('../models/Review');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      company
    } = req.body;

    Reviewer
      .create(({ name, company }))
      .then(reviewer => res.send(reviewer))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Reviewer
      .find()
      .select({ _id: true, name: true, company: true })
      .then(reviewers => res.send(reviewers))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    //reviews need id, rating, review, and fild (id and title)
    Promise.all([
      Reviewer
        .findById(req.params.id)
        .select({ _id: true, name: true, company: true }),
      Review
        .find({ reviewer: req.params.id })
        .populate('film', { _id: true, title: true })
        .select({ _id: true, rating: true, review: true, film: true })
    ])
      .then(([reviewer, reviews]) => {
        res.send({ ...reviewer.toJSON(), reviews });
      })
      .catch(next);
  })
  .put('/:id', (req, res, next) => {
    Reviewer
      .findByIdAndUpdate(req.params.id, req.body, { new: true })
      .then(updatedReviewer => res.send(updatedReviewer))
      .catch(next);
  });
  
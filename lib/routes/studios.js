const { Router } = require('express');
const Studio = require('../models/Studio');
const Film = require('../models/Film');

module.exports = Router()
  .post('/', (req, res, next) => {
    const {
      name,
      address
    } = req.body;

    Studio
      .create({ name, address })
      .then(studio => res.send(studio))
      .catch(next);
  })
  .get('/', (req, res, next) => {
    Studio
      .find()
      .select({ _id: true, name: true })
      .then(studios => res.send(studios))
      .catch(next);
  })
  .get('/:id', (req, res, next) => {
    //films _id and title
    Promise.all([
      Studio
        .findById(req.params.id)
        .select({ _id: true, name: true, address: true }),
      Film
        .find({ studio: req.params.id })
        .select({ _id: true, title: true })
    ])
      .then(([studio, films]) => {
        res.send({ ...studio.toJSON(), films });
      })
      .catch(next);
  })
  .delete('/:id', (req, res, next) => {
    Studio
      .findByIdAndDelete(req.params.id)
      .then(studio => res.send(studio))
      .catch(next);
  });

const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  studio: {
    ref: 'Studio',
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  released: {
    type: Number,
    min: 1800,
    max: 9999,
    required: true
  },
  cast: [{
    role: String,
    actor: {
      ref: 'Actor',
      type: mongoose.Schema.Types.ObjectId,
      required: true
    }
  }]
});

const Film = mongoose.model('Film', filmSchema);
module.exports = Film;

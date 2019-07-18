const mongoose = require('mongoose');

const filmSchema = new mongoose.Schema({
//title: <title of film RS>,
  title: {
    type: String,
    required: true
  },
// studio: <studio _id RI>,
  studio: {
    ref: 'Studio',
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
// released: <4-digit year RN>,
  released: {
    type: Number,
    min: 1800,
    max: 9999,
    required: true
  },
// cast: [{
//   role: <name of character S>,
//   actor: <actor _id RI>
// }]
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

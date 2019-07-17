const mongoose = require('mongoose');

const studioSchema = new mongoose.Schema({
  //name require
  name: {
    type: String,
    required: true
  },
  //address which has a city state country
  address: {
    city: String,
    state: String,
    country: String
  }
});

const Studio = mongoose.model('Studio', studioSchema);

module.exports = Studio;
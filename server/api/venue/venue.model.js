'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Venue = new Schema({
  name: {
    type: String,
    required: [true, 'name is required.']
  },
  tags: [String],
  address: {
    type: String,
    default: ''
  },
  capacity: {
    type: Number,
    default: 0
  }
});

module.exports = mongoose.model('Venue', Venue);
'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Rule = new Schema({
  personTags: [String],
  paymentTag: String,
  eventTag: String
});

module.exports = mongoose.model('Rule', Rule);

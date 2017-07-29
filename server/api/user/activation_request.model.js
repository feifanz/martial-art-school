'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var ActivationRequest = new Schema({
  user: {
    type: ObjectId,
    ref: 'User',
    required: [true, 'user is required.']
  },
  role: {
    type: String,
    required: [true, 'role is required.'],
    enum: ['admin', 'instructor']
  },
  status: {
    type: String,
    enum: ['PENDING', 'APPROVED', 'REJECTED'],
    default: 'PENDING'
  }
});

module.exports = mongoose.model('ActivationRequest', ActivationRequest);

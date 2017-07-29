'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;

var Person = new Schema({
  personType: {
    type: String,
    enum: ['student', 'instructor', 'admin'],
    required: [true, 'valid personType is required.']
  },
  firstName: {
    type: String,
    required: [true, 'firstName is required.']
  },
  lastName: {
    type: String,
    required: [true, 'lastName is required.']
  },
  birthday:{
    type: Date,
    //required: [true, 'birthday is required.']
    default:''
  },
  tag: {
    type: String,
    required: [true, 'tag is required']
  },
  phone: {
    type: String,
    default: ''
  },
  emailAddress: {
    type: String,
    default: ''
  },
  address: {
    type: String,
    default: ''
  },
  payment:{
    type: String,
    default:''
  },
  paymentExpireDate:{
    type: Date,
    default:''
  },
  medicalInfo:{
    type: String,
    default:''
  },
  user: {
    type: ObjectId,
    default: null
  }
});

module.exports = mongoose.model('Person', Person);

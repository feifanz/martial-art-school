'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var Message = new Schema({
  title: {
    type: String,
    required: [true, 'valid title is required.']
  },
  content: {
    type: String,
    default: ''
  },
  messageType: {
    type: String,
    enum: ['urgentFillIn', 'fillIn', 'generic', 'accessRequest'],
    required: [true, 'valid messageType is required.']
  },
  sendTime:{
    type: Date,
    default:''
  },
  reporter:{
	  type: String,
    required: [true, 'username is required.']
  },
  fillInVolunteers:[String],
  viewers:[String],
  fillInClass:{
    type:ObjectId,
    ref:'Event'
  }
});

module.exports = mongoose.model('Message', Message);

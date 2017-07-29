'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Tag = new Schema({
  tag: {
    type: String,
    required: [true, 'tag name is required']
  },
  tagType: {
    type: String,
    enum: ['person', 'event', 'payment'],
    required: [true, 'valid tag type is required.']
  }
});

module.exports = mongoose.model('Tag', Tag);

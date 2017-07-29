'use strict';

var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;

var AttendanceRecord = new Schema({
  attendee: {
    type: ObjectId,
    ref: 'Person'
  },
  inTime: {
    type: Date,
    default: null
  },
  outTime: {
    type: Date,
    default: null
  },
  comment: {
    type: String,
    default: null
  }
});

var Event = new Schema({
  name: {
    type: String,
    default: 'Event'
  },
  tag: String,
  venue: {
    type: ObjectId,
    ref: 'Venue',
    required: [true, 'venue is required.']
  },
  startTime: {
    type: Date,
    required: [true, 'startTime is required.']
  },
  durationMins: {
    type: Number,
    default: 60
  },
  instructors: [{
    type: ObjectId,
    ref: 'Person'
  }],
  attendees: [{
    type: ObjectId,
    ref: 'Person'
  }],
  attendanceRecords: [AttendanceRecord]
});

module.exports.Event = mongoose.model('Event', Event);
module.exports.AttendanceRecord = mongoose.model('AttendanceRecord', AttendanceRecord);
'use strict';

module.exports = {
  create: create,
  index: index,
  update:update,
  get: get,
  remove: remove,
  getAttendees: getAttendees,
  checkInOut: checkInOut,
  getAttendanceRecord: getAttendanceRecord,
  appendAttendees: appendAttendees
};

var Model = require('./event.model');
var Event = Model.Event;
var AttendanceRecord = Model.AttendanceRecord;

function create(req, res, next) {
  Event.create(req.body)
    .then(function(event) {
      res.status(201)
        .json(event.toObject({ versionKey: false }));
    }, next);
}

function index(req, res, next) {
  Event.find({})
    .then(function(events) {
      return Event.populate(events, 'venue');
    })
    .then(function(events) {
      res.status(200)
        .json(events.map(function (event) {
          return event.toObject({ versionKey: false });
        }));
    }, next);
}


function update(req, res, next){
  var id = req.params.id;

  Event.findByIdAndUpdate(id, {$set: req.body}, function(err, result){
    if(err){
      console.log("update failed! " + event._id);
      console.log(err);
      return res.sendStatus(400);
    }else{
      console.log("success");
      return res.sendStatus(202);
    }
  });
}

function appendAttendees(req,res,next){
  var eventId = req.body.eventId;

  Event.findByIdAndUpdate(
    eventId,
    {
      $set: {
        attendees:req.body.attendees
      }
    },
    function(err, result){
    if(err){
      console.log("update failed! " + event._id);
      console.log(err);
      return res.sendStatus(400);
    }else{
      console.log("success");
      return res.sendStatus(202);
    }
  });
}

function get(req, res, next) {
  var id = req.params.id;
  
  Event.findById(id)
    .then(function(event) {
      if (!event) {
        return res.status(400)
          .json({
            errors: [{
              message: 'Event not found.',
              data: { id: id }
            }]
          });
      }

      res.status(200)
        .json(event.toObject({ versionKey: false }));
    }, next);
}

function remove(req, res, next) {
  var id = req.params.id;
  
  Event.findByIdAndRemove(id)
    .then(function(event) {
      if (!event) {
        return res.status(400)
          .json({
            errors: [{
              message: 'Event not found.',
              data: { id: id }
            }]
          });
      }

      res.sendStatus(200);
    }, next);
}


function getAttendees(req, res, next){
  var id = req.params.eventId;

  Event.findById(id).populate('attendees')
    .then(function(event){
      if(!event){
        return res.status(400)
          .json({
            errors: [{
              message: 'Event not found.',
              data: { id: id }
            }]
          });
      }
      return res.status(200)
        .json(event.attendees.toObject({ versionKey: false }));
    }, next);
}

//check in/out & comment for stu record
function checkInOut(req, res, next){
  var eventId = req.body.eventId;
  var existed = false;

  Event.findById(eventId)
  .then(function(event){
    for (var i = event.attendanceRecords.length - 1; i >= 0; i--) {
      if(event.attendanceRecords[i].attendee == req.body.attendanceRecord.attendee){
        event.attendanceRecords[i] = req.body.attendanceRecord;
        existed = true;
        break;
      }
    }
    if(!existed){
      event.attendanceRecords.push(req.body.attendanceRecord);
    }
    event.markModified('attendanceRecords');
    event.save(function(err){
      if(err){
        return res.sendStatus(400);
      }
      return res.sendStatus(200);
    });
  });
}

function getAttendanceRecord(req, res, next){
  var eventId = req.params.eventId;
  Event.findById(eventId).populate('attendanceRecords.attendee')
  .then(function(event){
    if(event){
      return res.status(200)
        .json(event.attendanceRecords.toObject({ versionKey: false }));
    }
    return res.sendStatus(400);
  });
}
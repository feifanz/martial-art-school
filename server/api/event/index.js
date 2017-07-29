'use strict';

var auth = require('../../components/auth/auth.service');
var controller = require('./event.controller');
var express = require('express');
var isvalid = require('../../components/isvalid/isvalid');
var router = express.Router();

router.post('/',
  auth.authenticate(),
  controller.create);

router.get('/',
  auth.authenticate(),
  controller.index);

router.get('/:id',
  auth.authenticate(),
  isvalid('id', 'Event id invalid.'),
  controller.get);

router.delete('/:id',
  auth.authenticate(),
  isvalid('id', 'Event id invalid.'),
  controller.remove);

router.post('/update/:id',
  auth.authenticate(),
  isvalid('id', 'Event id invalid.'),
  controller.update);

router.post('/appendAttendees/',
  auth.authenticate(),
  controller.appendAttendees);

router.get('/getAttendees/:eventId',
  auth.authenticate(),
  isvalid('eventId', 'Event id invalid.'),
  controller.getAttendees);

router.post('/checkInOut/',
  auth.authenticate(),
  controller.checkInOut);

router.get('/getAttendanceRecord/:eventId',
  auth.authenticate(),
  isvalid('eventId', 'Event id invalid.'),
  controller.getAttendanceRecord);

module.exports = router;

'use strict';

var auth = require('../../components/auth/auth.service');
var controller = require('./person.controller');
var express = require('express');
var isvalid = require('../../components/isvalid/isvalid');
var router = express.Router();

router.post('/',
  auth.authenticate(),
  controller.create);

router.post('/update/:id',
  auth.authenticate(),
  isvalid('id', 'Person id invalid.'),
  controller.update);

router.get('/unlinked',
  auth.authenticate(),
  controller.findUnlinked);

router.get('/findAllStudents',
  auth.authenticate(),
  controller.findAllStudents);

router.get('/findAllInstructors',
  auth.authenticate(),
  controller.findAllInstructors);

router.get('/findById/:id',
  auth.authenticate(),
  isvalid('id', 'Person id invalid.'),
  controller.findById);

router.get('/findByName/:firstName/:lastName',
  auth.authenticate(),
  isvalid('firstName', 'firstName invalid.'),
  isvalid('lastName', 'lastName invalid.'),
  controller.findByName);

//method findAttendees requires request body format:
//{"attendees":["57c8e74de58ea5a005a10415", "57c8ede3e58ea5a005a10416"]}
router.post('/findAttendees',
  auth.authenticate(),
  controller.findAttendees);

router.delete('/:id',
  auth.authenticate(),
  isvalid('id', 'Person id invalid.'),
  controller.removeById);

router.delete('/',
  auth.authenticate(),
  controller.removeAll);

module.exports = router;
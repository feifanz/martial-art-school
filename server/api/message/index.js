'use strict';

var auth = require('../../components/auth/auth.service');
var controller = require('./message.controller');
var express = require('express');
var isvalid = require('../../components/isvalid/isvalid');
var router = express.Router();

router.post('/',
  auth.authenticate(),
  controller.create);

router.get('/',
  auth.authenticate(),
  controller.findAll);

router.get('/findAllExceptAccess/',
  auth.authenticate(),
  controller.findAllExceptAccess);

router.get('/findAllUrgentFillIn/',
  auth.authenticate(),
  controller.findAllUrgentFillIn);

router.get('/findAllGeneralFillIn/',
  auth.authenticate(),
  controller.findAllGeneralFillIn);

router.get('/findAllGeneric/',
  auth.authenticate(),
  controller.findAllGeneric);

router.get('/findAllAccessRequest/',
  auth.authenticate(),
  controller.findAllAccessRequest);

router.get('/findById/:id',
  auth.authenticate(),
  isvalid('id', 'Message id invalid.'),
  controller.findById);

router.delete('/:id',
  auth.authenticate(),
  isvalid('id', 'Message id invalid.'),
  controller.removeById);

router.delete('/',
  auth.authenticate(),
  controller.removeAll);

router.post('/updateVolunteers/:id',
  auth.authenticate(),
  isvalid('id', 'Message id invalid.'),
  controller.updateVolunteers);

router.post('/updateViewers/:id',
  auth.authenticate(),
  isvalid('id', 'Message id invalid.'),
  controller.updateViewers);

router.get('/getViewers/:id',
  auth.authenticate(),
  isvalid('id', 'Message id invalid.'),
  controller.getViewers);

module.exports = router;
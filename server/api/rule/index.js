'use strict';

var auth = require('../../components/auth/auth.service');
var controller = require('./rule.controller');
var express = require('express');
var isvalid = require('../../components/isvalid/isvalid');
var router = express.Router();

router.post('/',
  auth.authenticate(),
  controller.create);

router.get('/',
  auth.authenticate(),
  controller.findAll);

router.get('/:eventTag',
  auth.authenticate(),
  //eventTag here is not an object ID
  //isvalid('eventTag', 'eventTag invalid.'),
  controller.findByEventTag);

router.delete('/:id',
  auth.authenticate(),
  isvalid('id', 'Rule id invalid.'),
  controller.removeById);

router.delete('/',
  auth.authenticate(),
  controller.removeAll);


module.exports = router;
'use strict';

var auth = require('../../components/auth/auth.service');
var controller = require('./tag.controller');
var express = require('express');
var isvalid = require('../../components/isvalid/isvalid');
var router = express.Router();

router.post('/',
  auth.authenticate(),
  controller.create);

router.get('/findAllPersonTags/',
  auth.authenticate(),
  controller.findAllPersonTags);

router.get('/findAllEventTags/',
  auth.authenticate(),
  controller.findAllEventTags);

router.get('/findAllPaymentTags',
  auth.authenticate(),
  controller.findAllPaymentTags);

router.get('/',
  auth.authenticate(),
  controller.findAll);

router.delete('/:id',
  auth.authenticate(),
  isvalid('id', 'Tag id invalid.'),
  controller.removeById);

router.delete('/',
  auth.authenticate(),
  controller.removeAll);

module.exports = router;
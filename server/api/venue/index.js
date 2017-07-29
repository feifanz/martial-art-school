'use strict';

var auth = require('../../components/auth/auth.service');
var controller = require('./venue.controller');
var express = require('express');
var isvalid = require('../../components/isvalid/isvalid');
var router = express.Router();

router.post('/',
  auth.authenticate(),
  controller.create);

router.get('/',
  auth.authenticate(),
  controller.findAll);

router.get('/findById/:id',
  auth.authenticate(),
  isvalid('id', 'Venue id invalid.'),
  controller.findById);

router.get('/findByName/:name',
  auth.authenticate(),
  isvalid('name', 'name invalid.'),
  controller.findByName);

router.get('/findByCapacity/:capacity',
  auth.authenticate(),
  isvalid('capacity', 'capacity invalid.'),
  controller.findByCapacity);

router.delete('/:id',
  auth.authenticate(),
  isvalid('id', 'Venue id invalid.'),
  controller.removeById);

module.exports = router;
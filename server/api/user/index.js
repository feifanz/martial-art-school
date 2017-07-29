'use strict';

var auth = require('../../components/auth/auth.service');
var controller = require('./user.controller');
var express = require('express');
var isvalid = require('../../components/isvalid/isvalid');
var router = express.Router();

router.post('/requests',
  controller.createRequest);

router.get ('/requests',
  auth.hasRole('admin'),
  controller.getRequests);

router.post('/requests/:requestId/approve/:personId',
  isvalid('requestId', 'requestId invalid.'),
  isvalid('personId', 'personId invalid.'),
  auth.hasRole('admin'),
  controller.approveRequest);

router.post('/requests/:requestId/reject',
  isvalid('requestId', 'requestId invalid.'),
  auth.hasRole('admin'),
  controller.rejectRequest);

router.post('/requests/:requestId/reopen',
  isvalid('requestId', 'requestId invalid.'),
  auth.hasRole('admin'),
  controller.reopenRequest);

router.post('/requests/:requestId/revoke',
  isvalid('requestId', 'requestId invalid.'),
  auth.hasRole('admin'),
  controller.revokeRequest);


module.exports = router;

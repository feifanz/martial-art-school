'use strict';

var app = require('../../app');
var should = require('should');
var testutils = require('../../utils/testutils');
var User = require('./user.model');
var ActivationRequest = require('./activation_request.model');

describe('ActivationRequest model', function () {
  beforeEach(function(done) {
    testutils.clearDb()
      .then(function() { done(); });
  });

  afterEach(function(done) {
    testutils.clearDb()
      .then(function() { done(); });
  });

  it('should reject if no user', function (done) {
    ActivationRequest.create({ role: 'admin' })
    .then(null, function (err) {
      err.message.should.eql('ActivationRequest validation failed');
      err.name.should.eql('ValidationError');
      Object.keys(err.errors).length.should.eql(1);
      err.errors.user.message.should.eql('user is required.');
      done();
    });
  });

  it('should reject if no role', function (done) {
    User.create({
      username: 'test',
      email: 'test@test.com',
      password: 'test'
    })
    .then(function (user) {
      return ActivationRequest.create({ user: user._id });
    })
    .then(null, function (err) {
      err.message.should.eql('ActivationRequest validation failed');
      err.name.should.eql('ValidationError');
      Object.keys(err.errors).length.should.eql(1);
      err.errors.role.message.should.eql('role is required.');
      done();
    });
  });

  it('should reject if role is not valid', function (done) {
    User.create({
      username: 'test',
      email: 'test@test.com',
      password: 'test'
    })
    .then(function (user) {
      return ActivationRequest.create({ user: user._id, role: 'foo' });
    })
    .then(null, function (err) {
      err.message.should.eql('ActivationRequest validation failed');
      err.name.should.eql('ValidationError');
      Object.keys(err.errors).length.should.eql(1);
      err.errors.role.message.should.eql('`foo` is not a valid enum value for path `role`.');
      done();
    });
  });

  it('should succeed otherwise', function (done) {
    var user;

    User.create({
      username: 'test',
      email: 'test@test.com',
      password: 'test'
    })
    .then(function (_user) {
      user = _user;
      return ActivationRequest.create({ user: user._id, role: 'admin' });
    })
    .then(function (req) {
      String(req.user).should.eql(String(user._id));
      req.role.should.eql('admin');
      req.status.should.eql('PENDING');
      req._id.should.exist;
      done();
    });
  });
});
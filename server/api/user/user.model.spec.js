'use strict';

var app = require('../../app');
var should = require('should');
var testutils = require('../../utils/testutils');
var User = require('./user.model');

describe('User model', function () {
  beforeEach(function(done) {
    testutils.clearDb()
      .then(function() { done(); });
  });

  afterEach(function(done) {
    testutils.clearDb()
      .then(function() { done(); });
  });

  it('should reject if no username', function (done) {
    User.create({ email: 'test@test.com' })
    .then(null, function (err) {
      err.message.should.eql('User validation failed');
      err.name.should.eql('ValidationError');
      Object.keys(err.errors).length.should.eql(1);
      err.errors.username.message.should.eql('username is required.');
      done();
    });
  });

  it('should reject if no email', function (done) {
    User.create({ username: 'foo' })
    .then(null, function (err) {
      err.message.should.eql('User validation failed');
      err.name.should.eql('ValidationError');
      Object.keys(err.errors).length.should.eql(1);
      err.errors.email.message.should.eql('email is required.');
      done();
    });
  });

  it('should reject if email is invalid', function (done) {
    User.create({ username: 'foo', email: 'bar' })
    .then(null, function (err) {
      err.message.should.eql('User validation failed');
      err.name.should.eql('ValidationError');
      Object.keys(err.errors).length.should.eql(1);
      err.errors.email.message.should.eql('email is invalid.');
      done();
    });
  });

  it('should reject if the password is undefined', function (done) {
    User.create({ username: 'foo', email: 'test@test.com' })
    .then(null, function (err) {
      err.message.should.eql('Invalid password.');
      done();
    });
  });

  it('should reject if the password is empty', function (done) {
    User.create({ username: 'foo', email: 'test@test.com', password: '' })
    .then(null, function (err) {
      err.message.should.eql('User validation failed');
      err.name.should.eql('ValidationError');
      Object.keys(err.errors).length.should.eql(1);
      err.errors.hashedPassword.message.should.eql('password cannot be empty.');
      done();
    });
  });

  it('should succeed if username, email, and password are given', function (done) {
    User.create({ username: 'foo', email: 'test@test.com', password: 'bar' })
    .then(function (user) {
      user.username.should.eql('foo');
      user.hashedPassword.should.exist;
      user.salt.should.exist;
      done();
    });
  });

  it('should reject if username is taken', function (done) {
    User.create({ username: 'foo', email: 'test@test.com', password: 'bar' })
    .then(function (existingUser) {
      User.create({ username: 'foo', email: 'foo@foo.com', password: 'baz' })
      .then(null, function (err) {
        err.message.should.eql('User validation failed');
        err.name.should.eql('ValidationError');
        Object.keys(err.errors).length.should.eql(1);
        err.errors.username.message.should.eql('username is taken.');
        done();
      });
    });
  });

  it('should reject if email is taken', function (done) {
    User.create({ username: 'foo', email: 'test@test.com', password: 'bar' })
    .then(function (existingUser) {
      User.create({ username: 'bar', email: 'test@test.com', password: 'baz' })
      .then(null, function (err) {
        err.message.should.eql('User validation failed');
        err.name.should.eql('ValidationError');
        Object.keys(err.errors).length.should.eql(1);
        err.errors.email.message.should.eql('email is taken.');
        done();
      });
    });
  });

  it('authenticate should return false if the password does not match', function (done) {
    User.create({ username: 'foo', email: 'test@test.com', password: 'bar' })
    .then(function (user) {
      user.authenticate('quux').should.eql(false);
      done();
    });
  });

  it('authenticate should return true if the password matches', function (done) {
    User.create({ username: 'foo', email: 'test@test.com', password: 'bar' })
    .then(function (user) {
      user.authenticate('foo').should.eql(false);
      done();
    });
  });
});
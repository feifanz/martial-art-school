'use strict';

module.exports = {
  auth: auth,
  clearDb: clearDb
};

var _ = require('lodash');
var mongoose = require('mongoose');
var Person = require('../api/person/person.model');
var q = require('q');
var request = require('supertest');
var User = require('../api/user/user.model');

function clearDb() {
  var fns = [];

  for (var key in mongoose.connection.collections) {
    fns.push((function(collection) {
      return collection.remove({});
    })(mongoose.connection.collections[key]));
  }

  return Promise.all(fns);
}

/**
 * Generates a JWT token for the given user, and returns the token. If no user
 * is provided, generates a test user.
 *
 * @method authutil
 * @param {User} options.user An optional user. Default is a test user.
 * @param {Person} options.person An optional person. Default is a test person.
 * @param {String} options.url An optional url. Default is localhost.
 * @param {Number} options.port An optional port. Default is 9000.
 * @return {Promise} resolves to an object with user and token as properties.
 */
function auth (options) {
  var dfd = q.defer();

  options = options || {};
  var url = options.url || 'http://localhost';
  var port = (options.port !== undefined)? options.port : 9000;
  var server = request.agent(url + ':' + port);
  var userSpec = options.user || {
    username: 'test',
    email: 'test@test.com',
    password: 'test',
    activated: true
  };

  var user, person;

  User.create(userSpec)
  .then(function (_user) {
    user = _user;
    return Person.create(options.person || {
      personType: 'admin',
      firstName: 'Test',
      lastName: 'Test',
      tag: 'test',
      user: user._id
    });
  })
  .then(function (_person) {
    person = _person;
    user.person = person._id;
    return user.save();
  })
  .then(function (user) {
    server.post('/api/auth/login')
    .send({
      username: userSpec.username,
      password: userSpec.password,
      role: 'admin'
    })
    .expect(200)
    .end(function (err, res) {
      dfd.resolve({
        user: user,
        person: person,
        token: res.body.token
      });
    });
  });

  return dfd.promise;
}
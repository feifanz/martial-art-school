'use strict';

module.exports = {
  authenticate: authenticate,
  hasRole: hasRole,
  signToken: signToken
};

var compose = require('composable-middleware');
var config = require('../../config/env');
var validateJwt = require('express-jwt')({ secret: config.secret });
var jwt = require('jsonwebtoken');
var Person = require('../../api/person/person.model');
var User = require('../../api/user/user.model');

function authenticate() {
  return compose()

  // Validate jwt
  .use(function(req, res, next) {
    // allow access_token to be passed through query parameter as well
    if (req.query && req.query.hasOwnProperty('access_token')) {
      req.headers.authorization = 'Bearer ' + req.query.access_token;
    }
    validateJwt(req, res, next);
  })

  // Attach user to request
  .use(function(req, res, next) {
    User.findById(req.user._id, function(err, user) {
      if (err) return next(err);
      if (!user) return res.send(401);

      Person.populate(user, 'person')
      .then(function () {
        req.user = user;
        next();
      });
    });
  });
}

function hasRole(requiredRole) {
  return compose()
  .use(authenticate())
  .use(function (req, res, next) {
    var roles = ['student', 'instructor', 'admin'];
    var role = req.user.person.personType;
    var idx = roles.indexOf(role);
    var requiredIdx = roles.indexOf(requiredRole);
    if (idx >= requiredIdx) return next();
    res.sendStatus(403);
  });
}

function signToken(id) {
  return jwt.sign({ _id: id }, config.secret, {
    expiresIn: 60 * 60 * 2 // expires in 2 hours
  });
}

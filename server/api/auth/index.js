'use strict';

var auth = require('../../components/auth/auth.service');
var CustomStrategy = require('passport-custom');
var express = require('express');
var passport = require('passport');
var User = require('../../api/user/user.model');

passport.use(new CustomStrategy(function (req, done) {
  if (req.body.username === undefined)
    return done(null, false, { message: 'username is required.' });
  if (req.body.password === undefined)
    return done(null, false, { message: 'password is required.' });
  if (req.body.role === undefined)
    return done(null, false, { message: 'role is required.' });

  var roles = ['instructor', 'admin'];
  var requestedRoleIdx = roles.indexOf(req.body.role);
  if (requestedRoleIdx === -1)
    return done(null, false, { message: 'role is invalid.' });

  User
  .findOne({ username: req.body.username })
  .populate('person')
  .then(function (user) {
    if (!user)
      return done(null, false, { message: 'This username is not registered.' });

    if (!user.authenticate(req.body.password))
      return done(null, false, { message: 'This password is not correct.' });

    if (!user.activated)
      return done(null, false, { message: 'This account is not activated.' });

    if (!user.person)
      return done(null, false, { message: 'This account is not linked to a person.' });

    var actualRoleIdx = roles.indexOf(user.person.personType);
    if (requestedRoleIdx > actualRoleIdx)
      return done(null, false, { message: 'This account does not have sufficient role privileges.' });

    return done(null, user);
  }, function (err) {
    return done(err);
  });
}));

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

var router = express.Router();

router.post('/login', function (req, res, next) {
  passport.authenticate('custom', function (err, user, info) {
    var error = err || info;
    if (error) return res.status(401).json(error);
    if (!user) return res.status(404).json({
      message: 'Something went wrong, please try again.'
    });

    var token = auth.signToken(user._id);
    res.json({
      token: token,
      maxRole: user.person.personType
    });
  })(req, res, next);
});

module.exports = router;
'use strict';

var _ = require('lodash');
var crypto = require('crypto');
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;
var Schema = mongoose.Schema;
var validate = require('mongoose-validator');

var User = new Schema({
  username: {
    type: String,
    required: [true, 'username is required.']
  },
  email: {
    type: String,
    required: [true, 'email is required.'],
    validate: validate({
      validator: 'isEmail',
      message: 'email is invalid.'
    })
  },
  hashedPassword: String,
  salt: String,
  person: {
    type: ObjectId,
    ref: 'Person',
    default: null
  },
  activated: {
    type: Boolean,
    default: false
  }
});

User
  .path('username')
  .validate(function(val, done) {
    var self = this;
    this.constructor.findOne({ username: val }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(true);
      if (self.id === user.id) return done(true);
      done(false);
    });
  }, 'username is taken.');

User
  .path('email')
  .validate(function(val, done) {
    var self = this;
    this.constructor.findOne({ email: val }, function(err, user) {
      if (err) return done(err);
      if (!user) return done(true);
      if (self.id === user.id) return done(true);
      done(false);
    });
  }, 'email is taken.');

User
  .path('hashedPassword')
  .validate(function(hashedPassword) {
    return hashedPassword.length;
  }, 'password cannot be empty.');

User
  .virtual('password')
  .set(function (plainText) {
    this.salt = this.makeSalt();
    this.hashedPassword = this.encryptPassword(plainText);
  });

User
  .virtual('profile')
  .get(function() {
    return _.omit(this.toObject(), ['__v', 'hashedPassword', 'salt']);
  });

User
  .pre('save', function(next) {
    if (!this.isNew) return next();

    if (this.hashedPassword === undefined)
      return next(new Error('Invalid password.'));

    next();
  });

User.methods = {
  authenticate: function(plainText) {
    return this.encryptPassword(plainText) === this.hashedPassword;
  },
  makeSalt: function() {
    return crypto.randomBytes(16)
      .toString('base64');
  },
  encryptPassword: function(password) {
    if (!password || !this.salt) return '';
    var salt = new Buffer(this.salt, 'base64');
    return crypto.pbkdf2Sync(password, salt, 10000, 64)
      .toString('base64');
  }
}

module.exports = mongoose.model('User', User);

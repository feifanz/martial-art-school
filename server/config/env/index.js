'use strict';

var path = require('path');
var _ = require('lodash');

var baseConfig = {
  env: process.env.NODE_ENV,
  port: process.env.PORT || 9000,
  root: path.normalize(__dirname + '/../../..'),
  secret: process.env.SECRET || 'very_secure_secret',
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  }
};

var envConfig = require('./' + process.env.NODE_ENV || {});

module.exports = _.merge(baseConfig, envConfig);

/* Express config */

'use strict';

var bodyParser = require('body-parser');
var compression = require('compression');
var ejs = require('ejs');
var envConfig = require('./env');
var express = require('express');
var helmet = require('helmet');
var morgan = require('morgan');
var passport = require('passport');

module.exports = function(app) {
  app.set('views', envConfig.root + '/server/views');
  app.engine('html', ejs.renderFile);
  app.set('view engine', 'html');
  app.use(compression());
  app.use(helmet());
  app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    next();
  });
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(passport.initialize());
  app.use(express.static(envConfig.root + '/client/www'));
  app.set('appPath', envConfig.root + '/client/www');
  app.use(morgan('dev'));
};

/* Main app entry point */

'use strict';

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var config = require('./config/env');
var express = require('express');
var http = require('http');
var mongoose = require('mongoose');
mongoose.Promise = require('q').Promise;

mongoose.connect(config.mongo.uri, config.mongo.options);

var app = express();
require('./config/express')(app);
require('./routes')(app);

var server = http.createServer(app);
server.listen(config.port, function() {
  console.log('Listening on port %d in %s mode', config.port, app.get('env'));
});

exports = module.exports = app;

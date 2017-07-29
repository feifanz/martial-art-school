'use strict';

var errors = require('./components/errors');
var validationErrorFormatter = require('./utils/mongoose-validation-error-formatter');

module.exports = function(app) {
  app.use('/api/events', require('./api/event'));
  app.use('/api/persons', require('./api/person'));
  app.use('/api/rules', require('./api/rule'));
  app.use('/api/users', require('./api/user'));
  app.use('/api/venues', require('./api/venue'));
  app.use('/api/auth', require('./api/auth'));
  app.use('/api/tags', require('./api/tag'));
  app.use('/api/messages', require('./api/message'));

  // if err is a mongoose ValidationError, format it
  app.use(function(err, req, res, next) {
    next(validationErrorFormatter(err));
  });

  // send the error message
  app.use(function(err, req, res, next) {
    var status = 400;
    if (err.status) status = err.status;
    res.status(status)
      .json(err);
  });

  // All undefined asset or api routes should return a 404
  app.route('/:url(api|auth|components|app|bower_components|assets)/*')
    .get(errors[404]);

  // All other routes should redirect to index.html
  app.route('/*')
    .get(function(req, res) {
      res.sendFile(app.get('appPath') + '/index.html');
    })
};

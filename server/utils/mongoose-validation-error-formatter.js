'use strict';

var util = require('util');

module.exports = function(err) {
  if (err.name !== 'ValidationError') return err;

  var errors = [];

  Object.keys(err.errors)
    .forEach(function(field) {
      var error = err.errors[field];
      errors.push({ message: error.message });
    });

  return errors;
};

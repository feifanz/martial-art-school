'use strict';

var isValid = require('mongoose').Types.ObjectId.isValid;

/**
 * Generates an express middleware function that checks whether
 * req.params[idName] is a valid mongoose ObjectId.
 *
 * @class isvalid
 */

module.exports = function (idName, message) {
  return function (req, res, next) {
    var id = req.params[idName];

    if (!isValid(id)) {
      return res.status(400)
        .json({
          errors: [{
            message: message,
            data: { id: id }
          }]
        });
    }

    next();
  };
};

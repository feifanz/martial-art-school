'use strict';

module.exports = {
  createRequest: createRequest,
  getRequests: getRequests,
  approveRequest: approveRequest,
  rejectRequest: rejectRequest,
  reopenRequest: reopenRequest,
  revokeRequest: revokeRequest
};

var ActivationRequest = require('./activation_request.model');
var Person = require('../person/person.model');
var User = require('./user.model');

function createRequest (req, res, next) {
  var user, request;

  user = new User({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  });

  user.validate()
  .then(function () {
    request = new ActivationRequest({
      user: user._id,
      role: req.body.role
    });
    return request.validate();
  })
  .then(function () {
    return user.save();
  })
  .then(function () {
    return request.save();
  })
  .then(function (request) {
    var profile = user.profile;
    var ret = request.toObject({ versionKey: false });
    ret.user = profile;
    res.status(201).json(ret);
  })
  .catch(next);
}

function getRequests (req, res, next) {
  var reqs;

  ActivationRequest
  .find({})
  .populate('user')
  .then(function (_reqs) {
    reqs = _reqs;
  })

  // populate any users with person links
  .then(function () {
    var users = reqs.filter(function (req) {
        return !!req.user.person;
    }).map(function (req) {
      return req.user;
    });
    return Person.populate(users, 'person');
  })

  .then(function () {
    res.status(200).json(reqs.map(function (req) {
      var profile = req.user.profile;
      var ret = req.toObject({ versionKey: false });
      ret.user = profile;
      return ret;
    }));
  })
  .catch(next);
}

function approveRequest (req, res, next) {
  var request, person;

  ActivationRequest.findById(req.params.requestId)
  .then(function (_request) {
    if (!_request) throw { errors: [{ message: 'Request not found.' }] };
    request = _request;
    if (request.status !== 'PENDING')
      throw { errors: [{ message: 'Request is not currently pending.' }] };
    return Person.findById(req.params.personId);
  })
  .then(function (_person) {
    if (!_person) throw { errors: [{ message: 'Person not found.' }] };
    person = _person;
    if (person.user) throw { errors: [{ message: 'Person already linked to a user.' }] };
    return User.findById(request.user);
  })
  .then(function (user) {
    user.person = person._id;
    user.activated = true;
    return user.save();
  })
  .then(function (user) {
    person.user = user._id;
    person.personType = request.role;
    return person.save();
  })
  .then(function () {
    request.status = 'APPROVED';
    return request.save();
  })
  .then(function (request) {
    return ActivationRequest.populate(request, 'user')
    .then(function (request) {
      return Person.populate(request.user, 'person');
    })
    .then(function () {
      return request;
    });
  })
  .then(function (request) {
    var profile = request.user.profile;
    var ret = request.toObject({ versionKey: false });
    ret.user = profile;
    res.status(200).json(ret);
  })
  .catch(next);
}

function rejectRequest (req, res, next) {
  ActivationRequest.findById(req.params.requestId)
  .then(function (request) {
    if (!request) throw { errors: [{ message: 'Request not found.' }] };
    if (request.status !== 'PENDING')
      throw { errors: [{ message: 'Request is not currently pending.' }] };
    request.status = 'REJECTED';
    return request.save();
  })
  .then(function (request) {
    return ActivationRequest.populate(request, 'user')
    .then(function (request) {
      return Person.populate(request.user, 'person');
    })
    .then(function () {
      return request;
    });
  })
  .then(function (request) {
    var profile = request.user.profile;
    var ret = request.toObject({ versionKey: false });
    ret.user = profile;
    res.status(200).json(ret);
  })
  .catch(next);
}

function reopenRequest (req, res, next) {
  ActivationRequest.findById(req.params.requestId)
  .then(function (request) {
    if (!request) throw { errors: [{ message: 'Request not found.' }] };
    if (request.status !== 'REJECTED')
      throw { errors: [{ message: 'Request is not currently rejected.' }] };
    request.status = 'PENDING';
    return request.save();
  })
  .then(function (request) {
    return ActivationRequest.populate(request, 'user')
    .then(function (request) {
      return Person.populate(request.user, 'person');
    })
    .then(function () {
      return request;
    });
  })
  .then(function (request) {
    var profile = request.user.profile;
    var ret = request.toObject({ versionKey: false });
    ret.user = profile;
    res.status(200).json(ret);
  })
  .catch(next);
}

function revokeRequest (req, res, next) {
  var request;

  ActivationRequest.findById(req.params.requestId)
  .then(function (_request) {
    if (!_request) throw { errors: [{ message: 'Request not found.' }] };
    request = _request;
    if (request.status !== 'APPROVED')
      throw { errors: [{ message: 'Request is not currently approved.' }] };
    return User.findById(request.user);
  })
  .then(function (user) {
    if (!user.person) throw { errors: [{ message: 'User not linked to a person.' }] };
    var personId = user.person;
    user.person = null;
    user.activated = false;
    return user.save()
    .then(function () {
      return Person.findById(personId);
    });
  })
  .then(function (person) {
    if (!person) throw { errors: [{ message: 'Person not found.' }] };
    person.user = null;
    return person.save();
  })
  .then(function () {
    request.status = 'PENDING';
    return request.save();
  })
  .then(function (request) {
    return ActivationRequest.populate(request, 'user')
    .then(function (request) {
      return Person.populate(request.user, 'person');
    })
    .then(function () {
      return request;
    });
  })
  .then(function (request) {
    var profile = request.user.profile;
    var ret = request.toObject({ versionKey: false });
    ret.user = profile;
    res.status(200).json(ret);
  })
  .catch(next);
}
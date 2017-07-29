'use strict';

angular.module('app')
.service('User', function ($q, $http, API_URL) {
  var self = this;

  self.getRequests = function () {
    var dfd = $q.defer();

    $http.get(API_URL + '/users/requests')
    .then(function (response) {
      dfd.resolve(response.data);
    }, function (err) {
      dfd.reject(err);
    })

    return dfd.promise;
  };

  self.approveRequest = function (req, person) {
    var dfd = $q.defer();

    $http.post(API_URL + '/users/requests/' + req._id + '/approve/' + person._id)
    .then(function (response) {
      dfd.resolve(response.data);
    }, function (err) {
      dfd.reject(err);
    })

    return dfd.promise;
  };

  self.rejectRequest = function (req) {
    var dfd = $q.defer();

    $http.post(API_URL + '/users/requests/' + req._id + '/reject')
    .then(function (response) {
      dfd.resolve(response.data);
    }, function (err) {
      dfd.reject(err);
    })

    return dfd.promise;
  };

  self.reopenRequest = function (req) {
    var dfd = $q.defer();

    $http.post(API_URL + '/users/requests/' + req._id + '/reopen')
    .then(function (response) {
      dfd.resolve(response.data);
    }, function (err) {
      dfd.reject(err);
    })

    return dfd.promise;
  };

  self.revokeRequest = function (req) {
    var dfd = $q.defer();

    $http.post(API_URL + '/users/requests/' + req._id + '/revoke')
    .then(function (response) {
      dfd.resolve(response.data);
    }, function (err) {
      dfd.reject(err);
    })

    return dfd.promise;
  };
});

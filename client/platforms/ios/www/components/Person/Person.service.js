'use strict';

angular.module('app')
.service('Person', function ($q, $http, API_URL) {
  var self = this;

  self.unlinked = function () {
    var dfd = $q.defer();

    $http.get(API_URL + '/persons/unlinked')
    .then(function (response) {
      dfd.resolve(response.data);
    }, function (err) {
      dfd.reject(err);
    })

    return dfd.promise;
  };
});

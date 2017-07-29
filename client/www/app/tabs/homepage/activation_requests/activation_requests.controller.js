'use strict';

angular.module('app')
.controller('ActivationRequestsCtrl', function($scope, requests, persons,
  User, Person) {
  $scope.persons = persons;
  $scope.requests = requests;

  $scope.readyToApprove = function (request) {
    return !!request.person;
  };

  $scope.approve = function (request) {
    User.approveRequest(request, request.person)
    .then(function (newReq) {
      $scope.refresh(request, newReq);
    });
  };

  $scope.reject = function (request) {
    User.rejectRequest(request)
    .then(function (newReq) {
      $scope.refresh(request, newReq);
    });
  };

  $scope.reopen = function (request) {
    User.reopenRequest(request)
    .then(function (newReq) {
      $scope.refresh(request, newReq);
    });
  };

  $scope.revoke = function (request) {
    User.revokeRequest(request)
    .then(function (newReq) {
      $scope.refresh(request, newReq);
    });
  };

  $scope.refresh = function (oldReq, newReq) {
    var idx = $scope.requests.indexOf(oldReq);
    $scope.requests.splice(idx, 1, newReq);
    Person.unlinked().then(function (persons) {
      $scope.persons = persons;
    });
  };
});

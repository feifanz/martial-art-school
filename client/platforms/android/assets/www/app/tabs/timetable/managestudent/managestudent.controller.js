'use strict';

angular.module('app')
.controller('ManagestudentCtrl', function($scope, $http, $stateParams) {
  var self = this;
  var eventId = $stateParams.eventId;
  $scope.eventId = $stateParams.eventId;

  var url_attendees = "http://localhost:9000/api/events/getAttendees/";

  $scope.attendees = undefined;
  
  self.init = function() {
    $http.get(url_attendees + eventId)
    .success(function(data, status, header, config){
      $scope.attendees = data;
      console.log("fetch attendees("+eventId+") success");
    })
    .error(function(){
      console.log("fetch attendees("+eventId+") failed");
    });
  };


  self.init();

  $scope.doRefresh = function() {
     $http.get(url_attendees + eventId)
    .success(function(data, status, header, config){
      $scope.attendees = data;
      console.log("refresh attendees("+$scope.attendees+") success");
    })
    .error(function(){
      console.log("refresh attendees("+$scope.attendees+") failed");
    });

      $scope.$broadcast("scroll.refreshComplete");
    }

});

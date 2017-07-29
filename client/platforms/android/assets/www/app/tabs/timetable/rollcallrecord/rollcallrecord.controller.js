'use strict';

angular.module('app')
.controller('RollcallrecordCtrl', function($scope,$http, $stateParams) {
  var self = this;
  var eventId = $stateParams.eventId;
  var url_attendanceRecord = "http://localhost:9000/api/events/getAttendanceRecord/";

  $scope.records = undefined;

  self.init = function() {
    $http.get(url_attendanceRecord+eventId)
    .success(function(data, status, header, config){
      $scope.records = data;
      //console.log("fetch records success");
    })
    .error(function(){
      //console.log("fetch records failed");
    });
  };

  self.init();

  $scope.doRefresh = function(){
    $http.get(url_attendanceRecord+eventId)
    .success(function(data, status, header, config){
      $scope.records = data;
      //console.log("fetch records success");
    })
    .error(function(){
      //console.log("fetch records failed");
    });
    $scope.$broadcast("scroll.refreshComplete");
  }
    

});

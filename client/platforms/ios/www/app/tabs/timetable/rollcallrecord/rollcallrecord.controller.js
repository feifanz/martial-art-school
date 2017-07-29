'use strict';

angular.module('app')
.controller('RollcallrecordCtrl', function(API_URL, $scope,$http, $stateParams) {
  var self = this;
  var eventId = $stateParams.eventId;
  var url_attendanceRecord = API_URL + "/events/getAttendanceRecord/";

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

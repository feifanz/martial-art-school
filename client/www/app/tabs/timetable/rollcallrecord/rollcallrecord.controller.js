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
      formatTime($scope.records);
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
      formatTime($scope.records);
      //console.log("fetch records success");
    })
    .error(function(){
      //console.log("fetch records failed");
    });
    $scope.$broadcast("scroll.refreshComplete");
  }

  var formatTime = function(records){
    for (var i = records.length - 1; i >= 0; i--) {
      if(records[i].inTime){
        var inTime = new Date(records[i].inTime);
        records[i].inTime = {
          year: inTime.getFullYear(),
          month: inTime.getMonth()+1,
          day: inTime.getDate(),
          hh: twoDigits(inTime.getHours()),
          mm: twoDigits(inTime.getMinutes()),
          ss: twoDigits(inTime.getSeconds())
        };
      }
      if(records[i].outTime){
        var outTime = new Date(records[i].outTime);
        records[i].outTime = {
          year: outTime.getFullYear(),
          month: outTime.getMonth()+1,
          day: outTime.getDate(),
          hh: twoDigits(outTime.getHours()),
          mm: twoDigits(outTime.getMinutes()),
          ss: twoDigits(outTime.getSeconds())
        };
      }
    }
  };

  var twoDigits = function(data){
    if(String(data).length == 1){
      data = '0' + String(data);
    }
    return data;
  }

});

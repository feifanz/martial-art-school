'use strict';

angular.module('app')
.controller('RollcallCtrl',function(API_URL, $scope, $http, $stateParams, $ionicPopup) {
  var self = this;
  var eventId = $stateParams.eventId;

  var url_attendees = API_URL + "/events/getAttendees/";
  var url_checkInOut = API_URL + "/events/checkInOut/";
  var url_rule = API_URL + "/rules/"
  var url_event = API_URL + "/events/"
  var url_attendanceRecord = API_URL + "/events/getAttendanceRecord/"

  $scope.attendees = undefined;
  $scope.event = undefined;
  $scope.rule = undefined;
  $scope.attendanceRecord = undefined;

  $scope.record = {};
  
  self.init = function() {
    $http.get(url_attendees + eventId)
    .success(function(data, status, header, config){
      $scope.attendees = data;
      //console.log("fetch attendees("+eventId+") success");
      getEventRule();
      getAttendanceRecord();
    })
    .error(function(){
      //console.log("fetch attendees("+eventId+") failed");
    });
  };

  var getEventRule = function(){
    $http.get(url_event + eventId)
    .success(function(data, status, header, config){
      $scope.event = data;
      getRule();
    })
    .error(function(){
      //console.log("fetch event("+eventId+") failed");
    });
  };

  var getRule = function(){
    $http.get(url_rule + $scope.event.tag)
    .success(function(data, status, header, config){
      $scope.rule = data;
      checkRule();
    })
    .error(function(){
      //console.log("fetch rule("+$scope.event.tag+") failed");
    });
  };

  var checkRule = function(){
    for (var i = $scope.attendees.length - 1; i >= 0; i--) {
      //check person lvl
      $scope.attendees[i].lvl = "red";
      for(var j = $scope.rule[0].personTags.length - 1; j >= 0; j--){
        if($scope.attendees[i].tag == $scope.rule[0].personTags[j]){
          $scope.attendees[i].lvl = true;
          break;
        }
      }
      //check payment
      $scope.attendees[i].paid = "button-assertive";
      if($scope.attendees[i].payment == $scope.rule[0].paymentTag){
        $scope.attendees[i].paid = "button-balanced";
      }
    }
  };

  var getAttendanceRecord = function(){
    $http.get(url_attendanceRecord + eventId)
    .success(function(data, status, header, config){
      $scope.attendanceRecord = data;
      checkFlag();
    })
    .error(function(){
      //console.log("fetch attendanceRecord("+eventId+") failed");
    });
  };

  var checkFlag = function(){
    for (var i = $scope.attendees.length - 1; i >= 0; i--) {
      $scope.attendees[i].checkFlag = "Check In";
      for (var j = $scope.attendanceRecord.length - 1; j >= 0; j--) {
        if($scope.attendees[i]._id == $scope.attendanceRecord[j].attendee._id){
          $scope.attendees[i].attendanceRecord = $scope.attendanceRecord[j];
          $scope.attendees[i].attendanceRecord.attendee = $scope.attendanceRecord[j].attendee._id;
          if($scope.attendanceRecord[j].inTime != null){
            $scope.attendees[i].checkFlag = "Check Out";
            if($scope.attendanceRecord[j].outTime != null){
              $scope.attendees[i].checkFlag = "Checked";
            }
          }
          break;
        }
      }
    }
  }


  self.init();

  $scope.doRefresh = function() {
     $http.get(url_attendees + eventId)
    .success(function(data, status, header, config){
      $scope.attendees = data;
      //console.log("fetch attendees("+$scope.attendees+") success");
    })
    .error(function(){
      //console.log("fetch attendees("+$scope.attendees+") failed");
    });

      $scope.$broadcast("scroll.refreshComplete");
    };

  $scope.checkInOut = function(studentId){
    var timeStamp = new Date();
    var record ={};

    for (var i = $scope.attendees.length - 1; i >= 0; i--) {
      if($scope.attendees[i]._id == studentId){
        if($scope.attendees[i].attendanceRecord){
          record = $scope.attendees[i].attendanceRecord;
        }
        record.attendee = studentId;
        if($scope.attendees[i].checkFlag == "Check In"){
          record.inTime = timeStamp;
          $scope.attendees[i].checkFlag = "Check Out";
        }
        else if($scope.attendees[i].checkFlag == "Check Out"){
          record.outTime = timeStamp;
          $scope.attendees[i].checkFlag = "Checked";
        }
        else if($scope.attendees[i].checkFlag == "Checked"){
          alert("student already checked!");
          return;
        }
        $scope.attendees[i].attendanceRecord = record;
        break;
      }
    }

    var ReqBody = {
      eventId : eventId,
      attendanceRecord : record
    };

    $http.post(url_checkInOut, ReqBody)
    .success(function(){
      alert("Record added!");
    });
  }


  $scope.addComment = function(studentId) {

    $scope.record.comment = "";
    var record = {};

    //check existing comment
    for (var i = $scope.attendees.length - 1; i >= 0; i--) {
        if($scope.attendees[i]._id == studentId){
          //check record
          if($scope.attendees[i].attendanceRecord){
            $scope.record.comment = $scope.attendees[i].attendanceRecord.comment;
          }
          break;
        }
      }

    var alertPopup = $ionicPopup.show({
      template: '<input type="text" ng-model="record.comment">',
      title: 'Comment',
      scope: $scope,
      buttons: [
      {
        text: 'Cancel',
        //role: 'cancel',
      },
      {
        text: 'Save',
        type: 'button-positive',
        onTap: function(){
          return $scope.record.comment;
        }
      }
      ]
    });

    alertPopup.then(function(res) {
      for (var i = $scope.attendees.length - 1; i >= 0; i--) {
        if($scope.attendees[i]._id == studentId){
          //check record
          if($scope.attendees[i].attendanceRecord){
            record = $scope.attendees[i].attendanceRecord;
          }
          record.attendee = studentId;
          record.comment = res;
          $scope.attendees[i].attendanceRecord = record;
          break;
        }
      }

      var ReqBody = {
        eventId : eventId,
        attendanceRecord : record
      };

      $http.post(url_checkInOut, ReqBody)
      .success(function(){
        alert("Record added!");
      });

    });
  };

});

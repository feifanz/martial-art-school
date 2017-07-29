'use strict';

angular.module('app')
.controller('Add_student_to_classCtrl', function(API_URL, $scope, $http, $stateParams) {
  var self = this;
  var eventId = $stateParams.eventId;
  var url_event = API_URL + "/events/";
  var url_students = API_URL + "/persons/findAllStudents";

  $scope.event = undefined;
  $scope.students = undefined;
  //store the students have been selected
  $scope.studentList = new Array();

  self.init = function() {
    $http.get(url_students)
    .success(function(data, status, header, config){
      $scope.students = data;
      console.log("fetch students success");
      fetchEvent();
    })
    .error(function(){
      console.log("fetch students failed");
    });
  };

  var fetchEvent = function(){
    $http.get(url_event+eventId)
    .success(function(data, status, header, config){
      $scope.event = data;
      console.log("fetch event("+eventId+") success");
      $scope.event.startTime = new Date($scope.event.startTime);
      generateStuList();
    })
    .error(function(){
      console.log("fetch event("+eventId+") failed");
    });
  };

  var generateStuList = function(){
    for (var i = 0; i <= $scope.students.length - 1; i++) {
      var student ={
        id : $scope.students[i]._id,
        firstName : $scope.students[i].firstName,
        lastName : $scope.students[i].lastName,
        emailAddress : $scope.students[i].emailAddress,
        tag: $scope.students[i].tag,
        selected : checkAttendees($scope.students[i]._id)
      };
      $scope.studentList.push(student);
    }
  };

  var checkAttendees = function(id){
    for (var i = $scope.event.attendees.length - 1; i >= 0; i--) {
      if($scope.event.attendees[i] == id){
        return true;
      }
    }
    return false;
  };

  self.init();

  $scope.doRefresh = function(){
    //TODO refresh
    $http.get(url_students)
    .success(function(data, status, header, config){
      $scope.students = data;
      console.log("fetch students success");
    })
    .error(function(){
      console.log("fetch students failed");
    });

    $scope.$broadcast("scroll.refreshComplete");
  }


  $scope.appendAttendees = function() {
    console.log("update invoked");
    var attendees = new Array();
    for (var i = 0; i <= $scope.studentList.length - 1; i++) {
      if($scope.studentList[i].selected == true){
        attendees.push($scope.studentList[i].id);
      }
    }

    var ReqBody = {
      eventId : eventId,
      attendees : attendees
    };

    var updateUrl = API_URL + "/events/appendAttendees/";
    $http.post(updateUrl, ReqBody)
    .success(function(){
      alert("List Updated!");
    });
  }

});

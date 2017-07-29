'use strict';

angular.module('app')
.controller('Add_student_to_classCtrl', function($scope, $http, $stateParams) {
  var self = this;
  var eventId = $stateParams.eventId;
  var url_event = "http://localhost:9000/api/events/";
  var url_students = "http://localhost:9000/api/persons/findAllStudents";

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
      generateStuList();
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
        selected : false
      };
      $scope.studentList.push(student);
    }
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

    var updateUrl = "http://localhost:9000/api/events/appendAttendees/";
    $http.post(updateUrl, ReqBody)
    .success(function(){
      alert("List updated!");
    });
  }

});

'use strict';

angular.module('app')
.controller('CheckinstructorCtrl', function($scope, $http, $state) {
  var self = this;
  var url = "http://localhost:9000/api/persons/findAllInstructors";
  $scope.instructors = undefined;

  $scope.doRefresh = function(){
    $http.get(url)
    .success(function(data, status, header, config){
      $scope.instructors = data;
      console.log("fetch instructors success");
    })
    .error(function(){
      console.log("fetch instructors failed");
    });
      
    $scope.$broadcast("scroll.refreshComplete");
  }

  $scope.toInstructor = function(id){
    $state.go('tabs.editinstructor', {personId:id});
  }

  self.init = function() {
    $http.get(url)
    .success(function(data, status, header, config){
      $scope.instructors = data;
      console.log("fetch instructors success");
    })
    .error(function(){
      console.log("fetch instructors failed");
    });
  };

  self.init();
});

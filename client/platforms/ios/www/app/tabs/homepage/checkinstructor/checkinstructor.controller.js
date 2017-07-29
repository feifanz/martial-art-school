'use strict';

angular.module('app')
.controller('CheckinstructorCtrl', function(API_URL, $scope, $http, $state) {
  var self = this;
  var url = API_URL + "/persons/findAllInstructors";
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

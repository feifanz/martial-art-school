'use strict';

angular.module('app')
.controller('CheckstudentCtrl', function($scope, $http, $state) {
  var self = this;
  var url = "http://localhost:9000/api/persons/findAllStudents";
  $scope.students = undefined;

  self.init = function() {
    $http.get(url)
    .success(function(data, status, header, config){
      $scope.students = data;
      console.log("fetch students success");
    })
    .error(function(){
      console.log("fetch students failed");
    });
  }

  self.init();

  $scope.doRefresh = function(){
    //TODO refresh
    $http.get(url)
    .success(function(data, status, header, config){
      $scope.students = data;
      console.log("fetch students success");
    })
    .error(function(){
      console.log("fetch students failed");
    });
      
    $scope.$broadcast("scroll.refreshComplete");
  }

  $scope.toStudent = function(id){
    $state.go('tabs.editstudent', {personId : id});
  }
});

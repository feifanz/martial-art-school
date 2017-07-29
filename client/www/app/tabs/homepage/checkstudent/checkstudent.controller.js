'use strict';

angular.module('app')
.controller('CheckstudentCtrl', function(API_URL, $scope, $http, $state) {
  var self = this;
  var url = API_URL + "/persons/findAllStudents";
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

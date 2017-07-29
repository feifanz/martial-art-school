'use strict';

angular.module('app')
.controller('RoleInfoCtrl', function($scope,$state) {
  

  $scope.back = function(){
  	$state.go('signup');
  }
});
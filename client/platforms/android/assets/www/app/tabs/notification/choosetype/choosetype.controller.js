'use strict';

angular.module('app')
.controller('ChoosetypeCtrl', function($scope, $state) {
	
	
   $scope.newFillclass = function() {
      $state.go('tabs.newfill');
    }

   $scope.newMessage = function() {
      $state.go('tabs.newmessage');
    }

});
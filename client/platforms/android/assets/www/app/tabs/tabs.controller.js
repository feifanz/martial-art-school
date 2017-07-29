'use strict';

angular.module('app')
.controller('TabsCtrl', function($scope, $ionicHistory,$state) {
  $scope.go = function (state) {
    $ionicHistory.clearHistory();
    $ionicHistory.nextViewOptions({ disableBack: true });
    $state.go(state);
  };
});

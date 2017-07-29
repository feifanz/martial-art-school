'use strict';

angular.module('app')
  .controller('SignupCtrl', function($scope, $state, Auth, $ionicPopup) {
    $scope.roles = Auth.getAllRoles();

    $scope.data = {
      username: '',
      email: '',
      password: '',
      role: $scope.roles[0]
    };

    $scope.empty = function() {
      if (!$scope.data.username.length) return true;
      if (!$scope.data.email.length) return true;
      if (!$scope.data.password.length) return true;
      return false;
    };

    $scope.signup = function() {
      if ($scope.empty()) return;
      Auth.signup($scope.data)
      .then(function () {
        $state.go('signin', { username: $scope.data.username });
      }, function (err) {
        $ionicPopup.alert({
          title: 'Error',
          template: err.reduce(function (prev, err) {
            return prev + err.message + '\n';
          }, '')
        });
      });
    }
  });

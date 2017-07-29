'use strict';

angular.module('app')
  .controller('SigninCtrl', function($scope, $state, Auth, $ionicPopup, username) {
    $scope.roles = Auth.getAllRoles();
    $scope.data = { username: username, password: '', role: $scope.roles[0] };

    $scope.usernameIsEmpty = function() {
      return $scope.data.username.length === 0 || $scope.data.password.length === 0;
    };

    $scope.login = function() {
      Auth.login($scope.data.username, $scope.data.password, $scope.data.role)
        .then(function() {
          $state.go('tabs.homepage');
        }, function(err) {
          $ionicPopup.alert({
            title: 'Whoops!',
            template: err.message
          });
        });
    }
    $scope.login2 = function(){
      $state.go('tabs.homepage');
    }
  });

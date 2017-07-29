'use strict';

angular.module('app')
.controller('SettingsCtrl', function($scope, Auth) {
	$scope.roles = Auth.getRoles();
	$scope.data = {
		currentRole: Auth.getRole()
	};

	$scope.selectRole = function (role) {
		Auth.setRole(role);
	};

  $scope.signout = function () {
    Auth.logout();
  };
});

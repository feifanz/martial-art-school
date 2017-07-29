'use strict';

angular.module('app')
.controller('StudentCtrl', function($scope, links) {
	$scope.links = links;
});

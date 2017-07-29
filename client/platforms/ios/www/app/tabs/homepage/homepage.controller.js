'use strict';

angular.module('app')
.controller('HomepageCtrl', function($scope, links) {
	$scope.links = links;
});

'use strict';

angular.module('app')
.controller('TagsCtrl', function($scope, links) {
	$scope.links = links;
});

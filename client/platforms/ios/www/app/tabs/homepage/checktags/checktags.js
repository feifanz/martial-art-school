'use strict';

angular.module('app')
.config(function($stateProvider) {
	$stateProvider.
	state('tabs.checktags', {
    cache: false,
		url: '/checktags',
    views: {
      'tab-homepage': {
    		templateUrl: 'app/tabs/homepage/checktags/checktags.html',
    		controller: 'CheckTagsCtrl'	
      }
    }
	});
});

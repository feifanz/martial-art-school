'use strict';

angular.module('app')
.config(function($stateProvider) {
	$stateProvider.
	state('tabs.checkrules', {
    cache: false,
		url: '/checkrules',
    views: {
      'tab-homepage': {
    		templateUrl: 'app/tabs/homepage/checkrules/checkrules.html',
    		controller: 'CheckRulesCtrl'	
      }
    }
	});
});

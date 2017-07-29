'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.newinstructor', {
    url: '/newinstructor',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/newinstructor/newinstructor.html',
        controller: 'NewinstructorCtrl'
      }
    }
  });
});



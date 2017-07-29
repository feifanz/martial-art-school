'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.newstudent', {
    url: '/newstudent',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/newstudent/newstudent.html',
        controller: 'NewstudentCtrl'
      }
    }
  });
});



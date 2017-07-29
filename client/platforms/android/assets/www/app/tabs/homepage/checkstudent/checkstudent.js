'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.checkstudent', {
    url: '/checkstudent',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/checkstudent/checkstudent.html',
        controller: 'CheckstudentCtrl'
      }
    }
  });
});



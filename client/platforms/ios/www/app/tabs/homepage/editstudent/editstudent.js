'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.editstudent', {
    cache: false,
    url: '/editstudent/:personId',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/editstudent/editstudent.html',
        controller: 'EditstudentCtrl'
      }
    }
  });
});



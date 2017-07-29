'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.checkinstructor', {
    url: '/checkinstructor',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/checkinstructor/checkinstructor.html',
        controller: 'CheckinstructorCtrl'
      }
    }
  });
});



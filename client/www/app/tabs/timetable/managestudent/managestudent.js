'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.managestudent', {
    cache: false,
    url: '/managestudent/:eventId',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/managestudent/managestudent.html',
        controller: 'ManagestudentCtrl'
      }
    }
  });
});



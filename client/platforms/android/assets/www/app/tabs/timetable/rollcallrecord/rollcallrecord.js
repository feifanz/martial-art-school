'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.rollcallrecord', {
    cache: false,
    url: '/rollcallrecord/:eventId',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/rollcallrecord/rollcallrecord.html',
        controller: 'RollcallrecordCtrl'
      }
    }
  });
});



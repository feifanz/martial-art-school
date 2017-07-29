'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.rollcall', {
    cache: false,
    url: '/rollcall/:eventId',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/rollcall/rollcall.html',
        controller: 'RollcallCtrl'
      }
    }
  });
});

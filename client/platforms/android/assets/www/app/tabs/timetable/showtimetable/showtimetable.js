'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.showtimetable', {
    cache: false,
    url: '/showtimetable',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/showtimetable/showtimetable.html',
        controller: 'ShowtimetableCtrl'
      }
    }
  });
});



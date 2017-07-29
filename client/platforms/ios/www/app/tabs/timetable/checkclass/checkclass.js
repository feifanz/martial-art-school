'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.checkclass', {
    cache: false,
    url: '/checkclass',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/checkclass/checkclass.html',
        controller: 'CheckclassCtrl'
      }
    }
  });
});



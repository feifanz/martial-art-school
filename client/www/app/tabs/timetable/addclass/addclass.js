'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.addclass', {
    cache: false,
    url: '/addclass',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/addclass/addclass.html',
        controller: 'AddclassCtrl'
      }
    }
  });
});



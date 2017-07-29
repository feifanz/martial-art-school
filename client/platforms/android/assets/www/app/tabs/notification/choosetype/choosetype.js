'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.choosetype', {
    cache: false,
    url: '/choosetype',
    views: {
      'tab-notification': {
        templateUrl: 'app/tabs/notification/choosetype/choosetype.html',
        controller: 'ChoosetypeCtrl'
      }
    }
  });
});



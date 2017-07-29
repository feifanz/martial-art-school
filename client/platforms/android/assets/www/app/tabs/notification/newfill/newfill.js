'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.newfill', {
    cache: false,
    url: '/newfill',
    views: {
      'tab-notification': {
        templateUrl: 'app/tabs/notification/newfill/newfill.html',
        controller: 'NewfillCtrl'
      }
    }
  });
});
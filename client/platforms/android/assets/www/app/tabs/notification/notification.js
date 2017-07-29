'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.notification', {
    cache: false,
    url: '/notification',
    views: {
      'tab-notification': {
        templateUrl: 'app/tabs/notification/notification.html',
        controller: 'NotificationCtrl',
        controllerAs: 'ctrl'
      }
    }
  });
});

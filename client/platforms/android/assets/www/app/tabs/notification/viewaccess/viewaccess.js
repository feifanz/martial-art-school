'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.viewaccess', {
    cache: false,
    url: '/viewaccess/:messageId',
    views: {
      'tab-notification': {
        templateUrl: 'app/tabs/notification/viewaccess/viewaccess.html',
        controller: 'ViewaccessCtrl'
      }
    }
  });
});



'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.viewmessage', {
    cache: false,
    url: '/viewmessage/:messageId',
    views: {
      'tab-notification': {
        templateUrl: 'app/tabs/notification/viewmessage/viewmessage.html',
        controller: 'ViewmessageCtrl'
      }
    }
  });
});



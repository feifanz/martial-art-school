'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.newmessage', {
    cache: false,
    url: '/newmessage',
    views: {
      'tab-notification': {
        templateUrl: 'app/tabs/notification/newmessage/newmessage.html',
        controller: 'NewmessageCtrl'
      }
    }
  });
});



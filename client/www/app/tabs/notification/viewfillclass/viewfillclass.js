'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.viewfillclass', {
    cache: false,
    url: '/viewfillclass/:messageId',
    views: {
      'tab-notification': {
        templateUrl: 'app/tabs/notification/viewfillclass/viewfillclass.html',
        controller: 'ViewfillclassCtrl'
      }
    }
  });
});



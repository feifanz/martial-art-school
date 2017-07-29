'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.addrule', {
    url: '/addrule',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/addrule/addrule.html',
        controller: 'AddruleCtrl'
      }
    }
  });
});



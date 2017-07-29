'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs', {
  	cache: false,
    url: '/tabs',
    abstract: true,
    templateUrl: 'app/tabs/tabs.html',
    controller: 'TabsCtrl'
  });
});

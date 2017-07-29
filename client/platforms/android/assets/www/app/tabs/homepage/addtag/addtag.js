'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.addtag', {
    url: '/addtag',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/addtag/addtag.html',
        controller: 'AddTagCtrl'
      }
    }
  });
});



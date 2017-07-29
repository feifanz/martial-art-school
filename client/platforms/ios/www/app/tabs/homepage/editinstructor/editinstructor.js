'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.editinstructor', {
    url: '/editinstructor/:personId',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/editinstructor/editinstructor.html',
        controller: 'EditinstructorCtrl'
      }
    }
  });
});



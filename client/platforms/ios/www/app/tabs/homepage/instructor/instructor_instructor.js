'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.instructor_instructor', {
    url: '/instructor_instructor',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/instructor/instructor_instructor.html',
        controller: 'InstructorCtrl'
      }
    }
  });
});



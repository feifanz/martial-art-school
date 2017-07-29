'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.add_student_to_class', {
    url: '/add_student_to_class/:eventId',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/add_student_to_class/add_student_to_class.html',
        controller: 'Add_student_to_classCtrl'
      }
    }
  });
});



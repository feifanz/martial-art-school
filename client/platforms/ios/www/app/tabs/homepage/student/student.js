'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.student', {
    cache: false,
    url: '/student',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/student/student.html',
        controller: 'StudentCtrl'
      }
    },
    resolve: {
      links: function (Auth) {
        var role = Auth.getRole();
        var links = [];
        if (role === 'admin') {
          links.push({ title: 'Add a student', ref: 'tabs.newstudent' });
        }
        links.push({ title: 'Check students', ref: 'tabs.checkstudent' });
        return links;
      }
    }
  });
});



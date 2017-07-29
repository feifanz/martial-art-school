'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.instructor', {
    cache: false,
    url: '/instructor',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/instructor/instructor.html',
        controller: 'InstructorCtrl'
      }
    },
    resolve: {
      links: function (Auth) {
        var role = Auth.getRole();
        var links = [];
        if (role === 'admin') {
          links.push({ title: 'Add an instructor', ref: 'tabs.newinstructor' });
        }
        links.push({ title: 'Check instructors', ref: 'tabs.checkinstructor' });
        return links;
      }
    }
  });
});



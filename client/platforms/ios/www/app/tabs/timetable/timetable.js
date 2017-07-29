'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.timetable', {
    cache: false,
    url: '/timetable',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/timetable.html',
        controller: 'TimetableCtrl',
        controllerAs: 'ctrl'
      }
    },
    resolve: {
      links: function (Auth) {
        var role = Auth.getRole();
        var links = [];
        if (role === 'admin') {
          links.push({ title: 'Add a class', ref: 'tabs.addclass' });
        }
        links.push({ title: 'Check classes', ref: 'tabs.checkclass' });
        links.push({ title: 'Show class timetable', ref: 'tabs.showtimetable' });
        return links;
      }
    }
  });
});

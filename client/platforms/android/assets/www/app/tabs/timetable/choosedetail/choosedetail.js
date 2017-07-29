'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.choosedetail', {
    cache: false,
    url: '/choosedetail/:eventId',
    views: {
      'tab-timetable': {
        templateUrl: 'app/tabs/timetable/choosedetail/choosedetail.html',
        controller: 'ChoosedetailCtrl'
      }
    },
    resolve: {
      links: function (Auth) {
        var role = Auth.getRole();
        var links = [];
        if (role === 'admin') {
          links.push({ title: 'Manage students', ref: 'tabs.managestudent' });
        } else if (role === 'instructor') {
          links.push({ title: 'Roll call', ref: 'tabs.rollcall' });
        }
        links.push({ title: 'Rollcall records', ref: 'tabs.rollcallrecord' });
        return links;
      }
    }
  });
});



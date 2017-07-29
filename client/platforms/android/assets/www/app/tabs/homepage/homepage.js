'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.homepage', {
    cache: false,
    url: '/homepage',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/homepage.html',
        controller: 'HomepageCtrl',
        controllerAs: 'ctrl'
      }
    },
    resolve: {
      links: function (Auth) {
        var role = Auth.getRole();
        var links = [];
        if (role === 'admin') {
          links.push({
            title: 'Account activation requests',
            ref: 'tabs.activation_requests'
          });
        }
        links.push({ title: 'Rules', ref: 'tabs.rules' });
        links.push({ title: 'Students', ref: 'tabs.student' });
        links.push({ title: 'Instructors', ref: 'tabs.instructor' });
        links.push({ title: 'Tags', ref: 'tabs.tags' });
        return links;
      }
    }
  });
});

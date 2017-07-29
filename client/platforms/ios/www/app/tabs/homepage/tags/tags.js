'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.tags', {
    cache: false,
    url: '/tags',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/tags/tags.html',
        controller: 'TagsCtrl'
      }
    },
    resolve: {
      links: function (Auth) {
        var role = Auth.getRole();
        var links = [];
        if (role === 'admin') {
          links.push({ title: 'Add a tag', ref: 'tabs.addtag' });
        }
        links.push({ title: 'Check tags', ref: 'tabs.checktags' });
        return links;
      }
    }
  });
});
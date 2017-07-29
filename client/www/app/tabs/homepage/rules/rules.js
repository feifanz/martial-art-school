'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider.
  state('tabs.rules', {
    cache: false,
    url: '/rules',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/rules/rules.html',
        controller: 'RulesCtrl'
      }
    },
    resolve: {
      links: function (Auth) {
        var role = Auth.getRole();
        var links = [];
        if (role === 'admin') {
          links.push({ title: 'Add a rule', ref: 'tabs.addrule' });
        }
        links.push({ title: 'Check rules', ref: 'tabs.checkrules' });
        return links;
      }
    }
  });
});
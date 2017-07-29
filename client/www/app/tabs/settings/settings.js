'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.settings', {
    cache: false,
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'app/tabs/settings/settings.html',
        controller: 'SettingsCtrl',
        controllerAs: 'ctrl'
      }
    }
  });
});

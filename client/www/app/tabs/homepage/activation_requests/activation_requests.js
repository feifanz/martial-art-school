'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('tabs.activation_requests', {
    cache: false,
    url: '/activation_requests',
    views: {
      'tab-homepage': {
        templateUrl: 'app/tabs/homepage/activation_requests/activation_requests.html',
        controller: 'ActivationRequestsCtrl',
        controllerAs: 'ctrl'
      }
    },
    resolve: {
      persons: function (Person) {
        return Person.unlinked();
      },
      requests: function (User) {
        return User.getRequests();
      }
    }
  });
});

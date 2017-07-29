'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('roleInfo', {
    url: '/roleInfo',
    templateUrl: 'app/roleInfo/roleInfo.html',
    controller: 'RoleInfoCtrl'
  });
});
'use strict';

angular.module('app')
.config(function($stateProvider) {
  $stateProvider
  .state('signin', {
    url: '/signin',
    templateUrl: 'app/signin/signin.html',
    controller: 'SigninCtrl',
    params: {
    	'username': null
    },
    resolve: {
    	username: function ($stateParams) {
    		return $stateParams.username || '';
    	}
    }
  });
});
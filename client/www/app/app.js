angular.module('app', ['ionic', 'env'])
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if (window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

// Set default route
.config(function($urlRouterProvider) {
  $urlRouterProvider.otherwise('/signin');
})

// Auth
.factory('authInterceptor', function ($q, $injector) {
  return {
    // Add authorization token to headers
    request: function (config) {
      config.headers = config.headers || {};
      var token = localStorage.getItem('token');
      if (token) config.headers.Authorization = 'Bearer ' + token;
      return config;
    }
  };
})
.config(function ($httpProvider) {
  $httpProvider.interceptors.push('authInterceptor');
})

.run(function ($rootScope, $state, $ionicHistory, $ionicPopup) {
  $rootScope.$on('$stateChangeStart', function (event, toState) {
    //if (toState.url === '/signup') return;
    //if (toState.url === '/signin') return;
    return;
    var token = localStorage.getItem('token');
    if (token) return;
    event.preventDefault();
    $ionicHistory.clearHistory();
    $state.go('signin');
    $ionicPopup.alert({
      title: 'You were logged out',
      template: 'Please sign in.'
    });
  });
});
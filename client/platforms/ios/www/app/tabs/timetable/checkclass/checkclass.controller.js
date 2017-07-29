'use strict';

angular.module('app')
  .controller('CheckclassCtrl', function(API_URL, $scope, $http, $state) {
    var self = this;
    var url = API_URL + "/events";
    $scope.events = undefined;

    $scope.doRefresh = function() {
      $http.get(url)
        .success(function(data, status, header, config) {
          $scope.events = data;
          console.log("fetch events success");
        })
        .error(function() {
          console.log("fetch events failed");
        });

      $scope.$broadcast("scroll.refreshComplete");
    }

    $scope.toEvent = function(id) {
      $state.go('tabs.choosedetail', { eventId: id });
    }

    self.init = function() {
      $http.get(url)
        .success(function(data, status, header, config) {
          $scope.events = data;
          console.log("fetch events success");
        })
        .error(function() {
          console.log("fetch events failed");
        });
    };

    self.init();
  });

'use strict';

angular.module('app')
.controller('ChoosedetailCtrl', function($scope, $http, $stateParams, links) {
  var self = this;
  var eventId = $stateParams.eventId;
  var url_event = "http://localhost:9000/api/events/";
  var url_venue = "http://localhost:9000/api/venues/findById/";

  $scope.event = undefined;
  $scope.venue = undefined;
  
  self.init = function() {
    $scope.links = links;

    $http.get(url_event+eventId)
    .success(function(data, status, header, config){
      $scope.event = data;
      console.log("fetch event("+eventId+") success");
      $scope.event.startTime = new Date($scope.event.startTime);
      fetchVenue();
    })
    .error(function(){
      console.log("fetch event("+eventId+") failed");
    });
  };

  var fetchVenue = function(){
    $http.get(url_venue + $scope.event.venue)
    .success(function(data, status, header, config){
      $scope.venue = data;
      console.log("fetch venue("+$scope.event.venue+") success");
    })
    .error(function(){
      console.log("fetch venue("+$scope.event.venue+") failed");
    });
  };

  self.init();

  $scope.update = function() {
  	console.log("update invoked");
  	var updateUrl = "http://localhost:9000/api/events/update/";
  	$http.post(updateUrl+eventId, $scope.event)
    .success(function(){
      alert("Event updated!");
    });
  }

  $scope.remove = function(index){
    var delete_url = "http://localhost:9000/api/events/" + index;
    $http.delete(delete_url)
    .success(function(response){
      console.log("event:" + index + " delete success!");
      alert("Delete success!");
      $scope.doRefresh();
    })
    .error(function(){
      console.log("event:" + index + " delete failed!");
      alert("Delete failed!");
      $scope.doRefresh();
    });
  }

  $scope.toManageStudent = function(){
    $state.go('tabs.managestudent', {eventId : eventId});
  }

});
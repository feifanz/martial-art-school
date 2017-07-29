'use strict';

angular.module('app')
  .controller('ViewfillclassCtrl', function($scope, $http, $stateParams, Auth, $ionicPopup) {
  var self = this;
  var messageId = $stateParams.messageId;
  var user = Auth.getUser();
  var url_message = "http://localhost:9000/api/messages/findById/";
  var url_event = "http://localhost:9000/api/events/"
  var url_update = "http://localhost:9000/api/messages/updateVolunteers/";

  $scope.message = undefined;
  $scope.event = undefined;




  self.init = function() {

    $http.get(url_message+messageId)
    .success(function(data, status, header, config){
      $scope.message = data;
      console.log("fetch message("+messageId+") success");
      $scope.message.sendTime = new Date($scope.message.sendTime);
      fetchEvent();
    })
    .error(function(){
      console.log("fetch message("+messageId+") failed");
    });
  }

  var fetchEvent = function(){
    $http.get(url_event + $scope.message.fillInClass)
    .success(function(data, status, header, config){
      $scope.event = data;
      console.log("fetch event("+$scope.message.fillInClass+") success");
      $scope.event.startTime = new Date($scope.event.startTime);
    })
    .error(function(){
      console.log("fetch event("+$scope.message.fillInClass+") failed");
    });
  };

  self.init();

  $scope.volunteer = function(){
    var volunteers = new Array();
    volunteers = $scope.message.fillInVolunteers;
    var position = volunteers.indexOf(user);  
    if(position>=0){  
       $ionicPopup.alert({
        title:'You have been there!'
      });
    }else{
        console.log(volunteers);
        volunteers.push(user);  
        $http.post(url_update+messageId, volunteers)
    .success(function(){
         $ionicPopup.alert({
        title:'Hand Up!'
      });
    });
    }
    
    



  }
});

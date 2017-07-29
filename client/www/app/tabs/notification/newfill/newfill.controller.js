'use strict';

angular.module('app')
.controller('NewfillCtrl', function(API_URL, $scope, $http, Auth, $ionicPopup) {
    var self = this;
    var url_messages = API_URL + "/messages/";
    var url_events = API_URL + "/events";
    var user = Auth.getUser();
    $scope.events = undefined;

    self.init = function() {
      $http.get(url_events)
        .success(function(data, status, header, config) {
          $scope.events = data;
          formatTime($scope.events);
          console.log("fetch events success");
        })
        .error(function() {
          console.log("fetch events failed");
        });
    };

    self.init();

    var formatTime = function(events){
    	for (var i = events.length - 1; i >= 0; i--) {
    	  if(events[i].startTime){
    	    var startTime = new Date(events[i].startTime);
    	    events[i].startTime = {
    	      year: startTime.getFullYear(),
    	      month: startTime.getMonth()+1,
    	      day: startTime.getDate(),
    	      hh: twoDigits(startTime.getHours()),
    	      mm: twoDigits(startTime.getMinutes()),
    	      ss: twoDigits(startTime.getSeconds())
    	    };
    	  }
    	}
    };

    var twoDigits = function(data){
    	if(String(data).length == 1){
      	data = '0' + String(data);
    	}
    	return data;
  	};



    $scope.messageTypes = [
        {text: 'Urgent Fill In' , value: 'urgentFillIn'},
        {text: 'Fill In', value: 'fillIn'},
        
    ];

    $scope.message = {
        title : "",
        content : "",
        messageType : "",
        sendTime : "",
        reporter : user,
        fillInClass : ""
    };

    $scope.expandText = function(){
    var element = document.getElementById("txtnotes");
    element.style.height =  element.scrollHeight + "px";
    }

	$scope.submit = function () {
        $scope.message.sendTime = new Date();

    	if($scope.message.title== "" || $scope.message.title == undefined){
    		console.log("messageTitle empty");
    	}else if($scope.message.content == "" || $scope.message.content == undefined){
            console.log("messageContent empty");
    	}else if($scope.message.messageType == "" || $scope.message.messageType == undefined){
            console.log("messageType empty");
        }else if($scope.message.fillInClass == "" || $scope.message.fillInClass== undefined){
            console.log("fillInClass empty");
        }else{
    	    $http.post(url_messages, $scope.message)
            .success(function(){
                $ionicPopup.alert({
                title:'Message sent!'
                });
            });
        }
    };



});

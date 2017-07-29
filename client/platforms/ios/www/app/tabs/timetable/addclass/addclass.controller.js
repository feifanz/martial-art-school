'use strict';

angular.module('app')
.controller('AddclassCtrl', function(API_URL, $scope, $http) {
    var self = this;
    var url_venue = API_URL + "/venues";
    var url_tag = API_URL + "/tags/"

    $scope.venues = undefined;
    $scope.tags = undefined;

    self.init = function() {
        $http.get(url_venue)
        .success(function(data, status, header, config){
            $scope.venues = data;
            console.log("fetch events success");
        })
        .error(function(){
            console.log("fetch events failed");
        });

        $http.get(url_tag+"findAllEventTags/")
        .success(function(data, status, header, config){
            $scope.tags = data;
            console.log("fetch person tags success");
        })
        .error(function(){
            console.log("fetch person tags failed");
        });
    };
    
    self.init();
    
    $scope.event = {
        name : "",
        venue : "",
        tag : "",
        startTime : "",
        durationMins : ""
    };

	$scope.submit = function () {
    	console.log("submit called"); 

    	if($scope.event.name == "" || $scope.event.name == undefined){
    		console.log("eventName empty");
    	}else if($scope.event.tag == "" || $scope.event.tag == undefined){
            console.log("eventTage empty");
    	}else if($scope.event.venue == "" || $scope.event.venue == undefined){
            console.log("eventVenue empty");
        }else if($scope.event.startTime == "" || $scope.event.startTime == undefined){
            console.log("eventTime empty");
        }else if($scope.event.durationMins == "" || $scope.event.durationMins == undefined){
            console.log("eventDuration empty");
        }
        else{
    		var url = API_URL + "/events";
    	    $http.post(url, $scope.event)
            .success(function(){
                console.log("class added!");
                alert("Class added!");
            });
        }
    };

  
});

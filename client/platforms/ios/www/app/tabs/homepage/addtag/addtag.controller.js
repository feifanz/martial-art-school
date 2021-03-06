'use strict';

angular.module('app')
  .controller('AddTagCtrl', function(API_URL, $scope, $http) {
    var self = this;
    var url = API_URL + "/tags/"

    $scope.tagType = ["person", "event", "payment"];

    $scope.Tag = {
        tag: "",
        tagType: ""
    };

    $scope.submit = function () {
    	console.log("submit called"); 
    	if($scope.Tag.tag == "" || $scope.Tag.tag == undefined){
    		console.log("tag name empty");
    	}else if($scope.Tag.tagType == "" || $scope.Tag.tagType == undefined){
            console.log("tag type empty");
    	}else{
    		console.log($scope.Tag); 
    	    $http.post(url, $scope.Tag)
            .success(function(){
                console.log("Tag added!");
                alert("Tag added!");
            });
        }
    };
  });

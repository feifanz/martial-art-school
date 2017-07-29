'use strict';

angular.module('app')
.controller('NewmessageCtrl', function(API_URL, $scope, $http, Auth, $ionicPopup) {
    var url = API_URL + "/messages/";
    var user = Auth.getUser();
    console.log(user);

    $scope.message = {
        title : "",
        content : "",
        messageType : "generic",
        sendTime : "",
        reporter : user
    };

    $scope.expandText = function(){
    var element = document.getElementById("txtnotes");
    element.style.height =  element.scrollHeight + "px";
    }

	$scope.submit = function () {
    	console.log("submit called");
        $scope.message.sendTime = new Date();

    	if($scope.message.title== "" || $scope.message.title == undefined){
    		console.log("messageTitle empty");
    	}else if($scope.message.content == "" || $scope.message.content == undefined){
            console.log("messageContent empty");
    	}else if($scope.message.messageType == "" || $scope.message.messageType == undefined){
            console.log("messageType empty");
        }else{
    	    $http.post(url, $scope.message)
            .success(function(){
               $ionicPopup.alert({
                title:'Message sent!'
                });
            });
        }
    };

});

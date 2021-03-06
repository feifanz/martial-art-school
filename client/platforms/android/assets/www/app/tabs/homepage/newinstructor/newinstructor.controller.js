'use strict';

angular.module('app')
.controller('NewinstructorCtrl', function($scope, $http) {
    var self = this;
    var url_tag = "http://localhost:9000/api/tags/"

    $scope.tags = undefined;

    self.init = function() {
        $http.get(url_tag+"findAllPersonTags/")
        .success(function(data, status, header, config){
            $scope.tags = data;
            console.log("fetch person tags success");
        })
        .error(function(){
            console.log("fetch person tags failed");
        });
    }

    self.init();


	$scope.person = {};
    $scope.person.personType = "instructor";
    $scope.person.firstName = "" ;
    $scope.person.lastName = "" ;
    $scope.person.birthday = "" ;
    $scope.person.tag = "" ;
    $scope.person.phone = "" ;
	$scope.person.emailAddress = "" ;
	$scope.person.address = "" ;
    

     $scope.submit = function () {
    	console.log("submit called"); 
    	if($scope.person.firstName == "" || $scope.person.firstName == undefined){
    		console.log("firstName empty");
    	}else if($scope.person.lastName == "" || $scope.person.lastName == undefined){
            console.log("lastName empty");
    	}else if($scope.person.birthday == "" || $scope.person.birthday == undefined){
            console.log("birthday empty");
    	}else if($scope.person.tag == "" || $scope.person.tag == undefined){
            console.log("tag empty");
        }else if($scope.person.phone == "" || $scope.person.phone == undefined){
            console.log("phone empty");
    	}else if($scope.person.emailAddress == "" || $scope.person.emailAddress == undefined){
            console.log("emailAddress empty");
    	}else if($scope.person.address == "" || $scope.person.address == undefined){
            console.log("address empty");
    	}else{
    		var person = {
    		"personType" : $scope.person.personType,
    		"firstName" : $scope.person.firstName,
    		"lastName" : $scope.person.lastName,
    		"birthday" : $scope.person.birthday,
            "tag" : $scope.person.tag,
    		"phone" : $scope.person.phone,
    		"emailAddress" : $scope.person.emailAddress,
    		"address" : $scope.person.address,
    		}
    		console.log(person); 
    		var url = "http://localhost:9000/api/persons";
    	    $http.post(url, person)
            .success(function(){
                console.log("instructor added!");
                alert("instructor added!");
            });
        }
    };

});

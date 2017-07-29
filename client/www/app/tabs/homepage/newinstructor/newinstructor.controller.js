'use strict';

angular.module('app')
.controller('NewinstructorCtrl', function(API_URL, $scope, $http, $state) {
    var self = this;
    var url_tag = API_URL + "/tags/"

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
    		var url = API_URL + "/persons";
    	    $http.post(url, person)
            .success(function(){
                console.log("instructor added!");
                alert("instructor added!");
                $state.go("tabs.instructor");
            });
        }
    };

});

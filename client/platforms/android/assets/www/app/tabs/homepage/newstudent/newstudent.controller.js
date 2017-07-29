'use strict';

angular.module('app')
.controller('NewstudentCtrl', function($scope, $http, $state) {
    var self = this;
    var url_tag = "http://localhost:9000/api/tags/"

    $scope.payment = undefined;
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

        $http.get(url_tag+"findAllPaymentTags/")
        .success(function(data, status, header, config){
            $scope.payment = data;
            console.log("fetch payment tags success");
        })
        .error(function(){
            console.log("fetch payment tags failed");
        });
    }

    self.init();


	$scope.person = {
        personType : "student",
        firstName : "",
        lastName : "",
        birthday : "",
        tag : "",
        phone : "",
        emailAddress : "",
        address : "",
        payment : "",
        paymentExpireDate : "",
        medicalInfo : ""
    };

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
    	}else if($scope.person.payment == "" || $scope.person.payment == undefined){
            console.log("payment empty");
    	}else if($scope.person.paymentExpireDate == "" || $scope.person.paymentExpireDate == undefined){
            console.log("paymentExpireDate empty");
    	}else{
    		console.log($scope.person); 
    		var url = "http://localhost:9000/api/persons";
    	    $http.post(url, $scope.person)
            .success(function(){
                console.log("student added!");
                alert("student added!");
                $state.go("tabs.student");
            });
        }
    };
});

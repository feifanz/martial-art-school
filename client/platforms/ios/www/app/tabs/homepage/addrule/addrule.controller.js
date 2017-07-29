'use strict';

angular.module('app')
  .controller('AddruleCtrl', function(API_URL, $scope, $http) {
    var url_tag = API_URL + "/tags/"

    $scope.rule = {};
    $scope.personTags = undefined;
    $scope.paymentTags = undefined;
    $scope.eventTags = undefined;

    self.init = function() {
        $http.get(url_tag+"findAllPersonTags/")
        .success(function(data, status, header, config){
            $scope.personTags = data;
            //console.log("fetch person tags success");
        })
        .error(function(){
            //console.log("fetch person tags failed");
        });

        $http.get(url_tag+"findAllEventTags/")
        .success(function(data, status, header, config){
            $scope.eventTags = data;
            //console.log("fetch event tags success");
        })
        .error(function(){
            //console.log("fetch event tags failed");
        });

        $http.get(url_tag+"findAllPaymentTags/")
        .success(function(data, status, header, config){
            $scope.paymentTags = data;
            //console.log("fetch event tags success");
        })
        .error(function(){
            //console.log("fetch event tags failed");
        });
    }

    self.init();

    $scope.submit = function () {
    	console.log("submit called");
        var rule = {
              personTags : [],
              paymentTag : $scope.rule.paymentTag,
              eventTag : $scope.rule.eventTag
        };

        for (var i = $scope.personTags.length - 1; i >= 0; i--) {
            if($scope.personTags[i].selected){
                rule.personTags.push($scope.personTags[i].tag);
            }
        }
        //console.log(rule);

    	if(rule.personTags == "" || rule.personTags == undefined){
    		//console.log("personTags empty");
    	}else if(rule.eventTag == "" || rule.eventTag == undefined){
            //console.log("eventTags empty");
    	}else{
    		var url = API_URL + "/rules";
    	    $http.post(url, rule)
            .success(function(){
                //console.log("rule added!");
                alert("Rule added!");
            });
        }
    };
  });

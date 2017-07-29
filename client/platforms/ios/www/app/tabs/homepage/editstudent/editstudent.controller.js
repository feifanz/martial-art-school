'use strict';

angular.module('app')
.controller('EditstudentCtrl', function(API_URL, $scope, $http, $stateParams, $state, Auth) {
  var self = this;
  var personId = $stateParams.personId;
  var url_person = API_URL + "/persons/findById/";
  var url_tag = API_URL + "/tags/"

  $scope.student = undefined;
  $scope.tags = undefined;
  $scope.payment = undefined;

  self.init = function() {
    $http.get(url_person+personId)
    .success(function(data, status, header, config){
      $scope.student = data;
      console.log("fetch student("+personId+") success");
      $scope.student.birthday = new Date($scope.student.birthday);
      $scope.student.paymentExpireDate = new Date($scope.student.paymentExpireDate);
      getPersonTags();
      getPaymentTags();
    })
    .error(function(){
      console.log("fetch student("+personId+") failed");
    });

    $scope.canEdit = Auth.getRole() === 'admin';
  }

  var getPersonTags = function(){
    $http.get(url_tag+"findAllPersonTags/")
    .success(function(data, status, header, config){
        $scope.tags = data;
        console.log("fetch person tags success");
    })
    .error(function(){
        console.log("fetch person tags failed");
    });
  }

  var getPaymentTags = function(){
    $http.get(url_tag+"findAllPaymentTags/")
    .success(function(data, status, header, config){
        $scope.payment = data;
        console.log("fetch person tags success");
    })
    .error(function(){
        console.log("fetch person tags failed");
    });
  }

  self.init();

  $scope.update = function() {
  	console.log("update invoked");
  	var updateUrl = API_URL + "/persons/update/";
  	$http.post(updateUrl+personId, $scope.student)
    .success(function(){
      alert("Profile updated!");
    });
  }

  $scope.remove = function(index){
    var delete_url = API_URL + "/persons/" + index;
    $http.delete(delete_url)
    .success(function(response){
      console.log("student:" + index + " delete success!");
      alert("Delete success!");
      $state.go('tabs.checkstudent');
    })
    .error(function(){
      console.log("student:" + index + " delete failed!");
      alert("Delete failed!");
      $scope.doRefresh();
    });
  }


});

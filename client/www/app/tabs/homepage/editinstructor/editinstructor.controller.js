'use strict';

angular.module('app')
.controller('EditinstructorCtrl', function(API_URL, $scope, $http, $stateParams, Auth) {
  var self = this;
  var personId = $stateParams.personId;
  var url = API_URL + "/persons/findById/";
  var url_tag = API_URL + "/tags/"

  $scope.instructor = undefined;
  $scope.tags = undefined;

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

  $scope.update = function() {
  	console.log("update invoked");
  	var updateUrl = API_URL + "/persons/update/";
  	$http.post(updateUrl+personId, $scope.instructor)
    .success(function(){
      alert("Profile updated!");
    });
  }

  
  $scope.remove = function(index){
    var delete_url = API_URL + "/persons/" + index;
    $http.delete(delete_url)
    .success(function(response){
      console.log("instructor:" + index + " delete success!");
      alert("Delete success!");
      $scope.doRefresh();
    })
    .error(function(){
      console.log("instructor:" + index + " delete failed!");
      alert("Delete failed!");
      $scope.doRefresh();
    });
  }

  self.init = function() {
    $scope.canEdit = Auth.getRole() === 'admin';
    if($scope.canEdit){
      var select = document.getElementById("select");
      select.removeAttribute('disabled');
    }
    $http.get(url+personId)
    .success(function(data){
      $scope.instructor = data;
      console.log("fetch instructor("+personId+") success");
      $scope.instructor.birthday = new Date($scope.instructor.birthday);
      getPersonTags();
    })
    .error(function(){
      console.log("fetch instructor("+personId+") failed");
    });
  }

  self.init();
});

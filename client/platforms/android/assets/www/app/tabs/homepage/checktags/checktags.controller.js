
'use strict';

angular.module('app')
  .controller('CheckTagsCtrl', function($scope, $http, Auth) {
    var self = this;
    var url = "http://localhost:9000/api/tags";
    $scope.tags = undefined;

    self.init = function() {
      $scope.canDelete = Auth.getRole() === 'admin';
      $http.get(url)
      .success(function(data){
        $scope.tags = data;
        $scope.tags.sort(typeSort);
      });
    };

    self.init();

    var typeSort = function(a, b){
      return a.tagType.length - b.tagType.length;
    }

    $scope.doRefresh = function(){
      $http.get(url)
      .success(function(data){
        $scope.tags = data;
      });
      $scope.$broadcast("scroll.refreshComplete");
    }
    
  	$scope.remove = function(index){
  		var delete_url = url + '/' + index;
  		$http.delete(delete_url)
      .success(function(response){
        console.log("tag:" + index + " delete success!");
        $scope.doRefresh();
  		})
      .error(function(){
        console.log("tag:" + index + " delete failed!");
        $scope.doRefresh();
      });
  	}

  });

'use strict';

angular.module('app')
  .controller('CheckRulesCtrl', function(API_URL, $scope, $http, Auth) {
    var self = this;
    var url = API_URL + "/rules";
    $scope.rules = undefined;

    $scope.doRefresh = function(){
      $http.get(url)
      .success(function(data){
        $scope.rules = data;
      });
      $scope.$broadcast("scroll.refreshComplete");
    }
    
  	$scope.remove = function(index){
  		var delete_url = url + '/' + index;
  		$http.delete(delete_url)
      .success(function(response){
        //console.log("rule:" + index + " delete success!");
        $scope.doRefresh();
  		})
      .error(function(){
        //console.log("rule:" + index + " delete failed!");
        $scope.doRefresh();
      });
  	}
    
    self.init = function() {
      $scope.canDelete = Auth.getRole() === 'admin';
      $scope.doRefresh();
    };

    self.init();
  });

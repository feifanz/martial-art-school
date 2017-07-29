'use strict';

angular.module('app')
  .controller('ViewaccessCtrl', function(API_URL, $scope, $http, $stateParams) {
  var self = this;
  var messageId = $stateParams.messageId;
  var url = API_URL + "/messages/findById/";

  $scope.message = undefined;


  self.init = function() {

    $http.get(url+messageId)
    .success(function(data){
      $scope.message = data;
      console.log("fetch message("+messageId+") success");
      $scope.message.sendTime = new Date($scope.message.sendTime);
    })
    .error(function(){
      console.log("fetch message("+messageId+") failed");
    });
  }

  self.init();
});

'use strict';

angular.module('app')
.controller('NotificationCtrl', function(API_URL, $scope, $http, $state, Auth) {
    var self = this;
    var url_messages = API_URL + "/messages";
    var url_exceptAccess = API_URL + "/messages/findAllExceptAccess/";
    var url_updateViewer = API_URL + "/messages/updateViewers/";
    var url_getViewer = API_URL + "/messages/getViewers/";
    var user = Auth.getUser();
    var viewers = new Array();

   

    $scope.messages = undefined;

    var fetchViewer = function(id){
       $http.get(url_getViewer+id)
        .success(function(data, status, header, config){
          viewers = [].concat(data);
          updateViewer(id,viewers);
        })
        .error(function(){
        });
    };

    var updateViewer = function(id,viewers){
    var position = viewers.indexOf(user);  

    if(position<0){  
        viewers.push(user);  
        $http.post(url_updateViewer+id, viewers)
        .success(function(){
        });
    };
    };

    var generateSeenMessages = function(){
    $scope.seenMessages = new Array();

    for (var i = 0; i <= $scope.messages.length - 1; i++) {
      var message ={
        id : $scope.messages[i]._id,
        title : $scope.messages[i].title,
        reporter : $scope.messages[i].reporter,
        messageType : $scope.messages[i].messageType,
        sendTime : $scope.messages[i].sendTime,
        selected : false
      };
      var pos = $scope.messages[i].viewers.indexOf(user);  
      if(pos>=0){  
          message.selected = true;
      }
      $scope.seenMessages.push(message);
    }
  };

    $scope.doRefresh = function() {
      if( Auth.getRole() == 'admin'){
      $http.get(url_messages)
        .success(function(data, status, header, config) {
          $scope.messages = data;
          console.log("fetch messages success");
          generateSeenMessages();
        })
        .error(function() {
          console.log("fetch messages failed");
        });

      $scope.$broadcast("scroll.refreshComplete");
    }else{
      $http.get(url_exceptAccess)
        .success(function(data, status, header, config) {
          $scope.messages = data;
          console.log("fetch messages success");
          generateSeenMessages();
        })
        .error(function() {
          console.log("fetch messages failed");
        });

      $scope.$broadcast("scroll.refreshComplete");

    }
    }

    $scope.toMessage = function(id,messageType) {
      fetchViewer(id);
      if(messageType === "generic"){
      $state.go('tabs.viewmessage', { messageId: id });
      }
      else if(messageType === "urgentFillIn" || messageType === "fillIn"){
      $state.go('tabs.viewfillclass', { messageId: id });
      }
      else if(messageType === "accessRequest" ){
        $state.go('tabs.viewaccess', { messageId: id });
      }
    };

    

    $scope.newMessage = function() {
      $state.go('tabs.choosetype');
    };


    self.init = function() {
        $scope.doRefresh();
    };

    self.init();
});

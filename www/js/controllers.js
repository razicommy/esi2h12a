angular.module('app.controllers', [])
  
.controller('welcomeCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      UserService.initData();
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;

      ProfileService.initData();
      $scope.app.profile = ProfileService.data.profile;

      /* INIT END */
      /* onAuthStateChanged BEGIN */
      $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
        console.log("welcome-onAuthStateChanged");
        $ionicLoading._getLoader().then(function(state) {
          if (state.isShown == true) {
            $ionicLoading.hide();
          }
        });
        UserService.updateAppUser(objAuthUser);
        //ProfileService.updateAppProfile(objAuthUser);
      });
      /* onAuthStateChanged END */
      

      
      
      
      
      
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
        switch (strCmdGrp) {
          case "auth":
            AuthService.doAction(strCmd);
            break;
          case "profile":
            ProfileService.doAction(strCmd);
            break;
        }
      };
      /* userAction END */      
      
      
}])
   
.controller('homeCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseObject', '$firebaseArray', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseObject,
      $firebaseArray,      
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      //UserService.initData();
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      console.log('$scope.app.user')
      console.log($scope.app.user)

      //ProfileService.initData();
      //$scope.app.profile = ProfileService.data.profile;

      /* INIT END */
      /* onAuthStateChanged BEGIN */
      $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
        console.log("home-onAuthStateChanged");
        $ionicLoading._getLoader().then(function(state) {
          if (state.isShown == true) {
            $ionicLoading.hide();
          }
        });
        UserService.updateAppUser(objAuthUser);
      });
      /* onAuthStateChanged END */            
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
          alert(strCmdGrp + strCmd)
        switch (strCmdGrp) {
        }
      };
      /* userAction END */


      /* RESOURCE LIST */
      






 
   $scope.getImage = function(img) {
    var imgBlank =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    //console.log(img);
    if (img) {
      if (img !== "") {
        return img;
      }
    } else {
      return imgBlank;
    }
  };
   
   
   $scope.selectResourceItem=function(objItem){
       var objParam={data:objItem}
       
       $state.go('view',objParam)

   }
   
      var getResourceList=function(){
          console.log('getResourceList')
          console.log($scope.app.user.email)
          $ionicLoading.show();
          
        var ref = firebase
          .database()
          .ref()
          .child("user-resources/" + $scope.app.user.uid);
        $scope.resources = $firebaseArray(ref);
        console.log($scope.resources);
        $scope.resources
          .$loaded()
          .then(function() {
            //console.log($scope.data);
            //alert('done')
            $ionicLoading._getLoader().then(function(state) {
              console.log(state.isShown);
              $ionicLoading.hide();
            });
          })
          .catch(function(err) {
            console.error(err);
            $ionicLoading._getLoader().then(function(state) {
              console.log(state.isShown);
              $ionicLoading.hide();
            });
          });
      }/*getResourceList*/


     $scope.$on("$ionicView.enter",function(){
         console.log('enter')
 
     } )
     $scope.$on("$ionicView.leave",function(){
         console.log('leave')
               
     } )      
      
     $scope.$on("$ionicView.loaded", function() {
         console.log('loaded')
                getResourceList()       
      });      
     $scope.$on("$ionicView.unloaded", function() {
         console.log('unloaded')
         
      });      
   
      
      /* RESOURCE LIST END */

  
  
  

}])
   
.controller('noteCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      console.log($scope.app)
      /* INIT END */
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
          alert(strCmdGrp + strCmd)
        switch (strCmdGrp) {
        }
      };
      /* userAction END */

console.log($stateParams)





}])
   
.controller('locationCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      /* INIT END */
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
          alert(strCmdGrp + strCmd)
        switch (strCmdGrp) {
        }
      };
      /* userAction END */

}])
   
.controller('viewCtrl', ['$scope', '$state', '$stateParams', '$ionicHistory', '$window', '$ionicLoading', '$ionicPopover', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicHistory,
      $window,
      $ionicLoading,
      $ionicPopover,
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      /* INIT END */
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
          alert(strCmdGrp + strCmd)
        switch (strCmdGrp) {
        }
      };
      /* userAction END */
      
   $scope.getImage = function(img) {
    var imgBlank =
      "data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==";
    //console.log(img);
    if (img) {
      if (img !== "") {
        return img;
      }
    } else {
      return imgBlank;
    }
  };


$scope.userAction=function(strCmd){
    console.log(strCmd)
    switch(strCmd){
     case 'back': //$ionicHistory.goBack();   
     window.history.back(); 
     break;
    }
    
}
         
      
      $scope.$on("$ionicView.enter", function() {
$scope.data = angular.fromJson($stateParams.data)
console.log($scope.data.format)

if ($scope.data.format=="video"){
      if ($scope.data.slink) {
          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function(event) {
            var blob = xhr.response;
            console.log(blob);
            vurl=URL.createObjectURL(blob)
            
            
	var v = "<video width='100%' controls='controls'>";
	v += "<source src='" + vurl + "' type='video/mp4'>";
	v += "</video>";
	document.querySelector("#videoArea").innerHTML = v;            
            
            
          };
          xhr.open("GET", $scope.data.slink);
          xhr.send();
      }    
}

if ($scope.data.format=="image"){
      if ($scope.data.slink) {
          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function(event) {
            var blob = xhr.response;
            console.log(blob);
            mediaurl=URL.createObjectURL(blob)
            
            
	var elm = "<image width='100%' ";
	elm += " src='" + mediaurl + "' />";

	document.querySelector("#imageArea").innerHTML = elm;            
            
            
          };
          xhr.open("GET", $scope.data.slink);
          xhr.send();
      }        
    
}    





          
          
      });      
      
      
      
      





/* POP OVER */
   var template = '<ion-popover-view>' + '<ion-header-bar>' +
      '<h1 class = "title">Edit Note</h1>' +
      '</ion-header-bar>'+ '<ion-content class="padding">' +
      'Desc:<input type = "text" ng-model = "data.desc">'+
      'Ref:<input type = "text" ng-model = "data.ref">'+
      'Latlon1:<input type = "text" ng-model = "data.latlon1">'+
      'Latlon2:<input type = "text" ng-model = "data.latlon2">'+
      'Distance:<input type = "text" ng-model = "data.distance">'+
      'Height:<input type = "text" ng-model = "data.height">'+
      '</ion-content>' + '</ion-popover-view>';

   $scope.popover = $ionicPopover.fromTemplate(template, {
      scope: $scope
   });

   $scope.editNote = function($event) {
      $scope.popover.show($event);
   };

   $scope.closePopover = function() {
      $scope.popover.hide();
   };

   //Cleanup the popover when we're done with it!
   $scope.$on('$destroy', function() {
      $scope.popover.remove();
   });

   // Execute action on hide popover
   $scope.$on('popover.hidden', function() {
      // Execute action
   });

   // Execute action on remove popover
   $scope.$on('popover.removed', function() {
      // Execute action
   });



}])
   
.controller('videoCaptureCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      /* INIT END */
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
          alert(strCmdGrp + strCmd)
        switch (strCmdGrp) {
        }
      };
      /* userAction END */

}])
   
.controller('dimensionCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      /* INIT END */
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
          alert(strCmdGrp + strCmd)
        switch (strCmdGrp) {
        }
      };
      /* userAction END */

}])
   
.controller('sketchCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseAuth', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseAuth,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      /* INIT END */
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {
          alert(strCmdGrp + strCmd)
        switch (strCmdGrp) {
        }
      };
      /* userAction END */

}])
   
.controller('cartCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('cloudCtrl', ['$scope', '$stateParams', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
function ($scope, $stateParams) {


}])
   
.controller('menuCtrl', ['$scope', '$state', '$stateParams', '$ionicLoading', '$firebaseAuth', '$firebaseArray', 'UserService', 'DefaultsFactory', 'AuthService', 'ProfileService', function (
      $scope,
      $state,
      $stateParams,
      $ionicLoading,
      $firebaseAuth,
      $firebaseArray,
      UserService,
      DefaultsFactory,
      AuthService,
      ProfileService    
    
    ) {

      /* onAuthStateChanged BEGIN */
      $firebaseAuth().$onAuthStateChanged(function(objAuthUser) {
        console.log("menu-onAuthStateChanged");
        $ionicLoading._getLoader().then(function(state) {
          if (state.isShown == true) {
            $ionicLoading.hide();
          }
        });
        UserService.updateAppUser(objAuthUser);
      });
      /* onAuthStateChanged END */      
      /* userAction BEGIN */
      $scope.userAction = function(strCmdGrp, strCmd) {

        switch (strCmdGrp) {
          case "auth":
            AuthService.doAction(strCmd);
            break;
          case "profile":
            ProfileService.doAction(strCmd);
            break;
        }
      };
      /* userAction END */
     $scope.$on("$ionicView.enter",function(){
         console.log('enter')
      /* INIT BEGIN */
      $scope.app = { user: {}, status: {}, defaults: {} };
      $scope.app.defaults = DefaultsFactory.defaults;
      $scope.app.user = UserService.data.user;
      $scope.app.status = UserService.data.status;
      $scope.app.profile = ProfileService.data.profile;
      /* INIT END */
     } )
  
        
        
    }])
 
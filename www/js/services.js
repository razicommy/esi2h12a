angular.module('app.services', [])

.factory('BlankFactory', [function(){

}])

.service('BlankService', [function(){

}])

angular
  .module("app.services", [])
  .factory("BlankFactory", [function() {}])
  .service("BlankService", [function() {}])
  .service("FireService", function($q, $firebaseObject) {
  /*http://bitmovin.com/docs/encoding/faqs/how-do-i-set-up-cors-for-my-google-cloud-storage-bucket*/
    /* GET CLOUD DATA */
    this.getCloudData = function(strDatabasePath) {
      var deferred = $q.defer();
      console.log("creating cloud dbs ref");
      var dbref = firebase
        .database()
        .ref()
        .child(strDatabasePath);
      console.log("creating cloud data object");
      var objRecord = $firebaseObject(dbref);
      console.log("saving cloud data object");
      objRecord
        .$loaded()
        .then(function(data) {
          //console.log(data === obj); // true
          //console.log('loaded data')
          //console.log(angular.copy(data));
          deferred.resolve(angular.copy(data));
          objRecord.$destroy();
        })
        .catch(function(error) {
          console.error("Error:", error);
          deferred.reject(null);
        });
      return deferred.promise;
    };
    /* GET CLOUD DATA END*/
    /* SET CLOUD DATA */
    this.setCloudData = function(strDatabasePath, objItem) {
      console.log("creating cloud dbs ref");
      var dbref = firebase
        .database()
        .ref()
        .child(strDatabasePath);
      console.log("creating cloud data object");
      var objRecord = $firebaseObject(dbref);
      console.log("copying local data to cloud data object");
      dataFields.forEach(function(field) {
        objRecord[field] = objItem[field] || "";
      });
      console.log("saving cloud data object");
      objRecord.$save().then(
        function(ref) {
          //console.log(ref.key)
          console.log(ref.key === objRecord.$id); // true
          console.log("destroy cloud data object");
          objRecord.$destroy();
        },
        function(error) {
          console.log("Error:", error);
        }
      );
    };
    /* SET CLOUD DATA END */
    /* GET CLOUD STORAGE */
    this.getCloudStorage = function(strStoragePath) {
      var stRef = firebase.storage().ref(strStoragePath);
      console.log("getDownloadURL");
      stRef
        .getDownloadURL()
        .then(function(url) {
          console.log(url);
          // `url` is the download URL for 'images/stars.jpg'
          // This can be downloaded directly:
          var xhr = new XMLHttpRequest();
          xhr.responseType = "blob";
          xhr.onload = function(event) {
            var blob = xhr.response;
            console.log(blob);
          };
          xhr.open("GET", url);
          xhr.send();
          // Or inserted into an <img> element:
          /*
  var img = document.getElementById('myimg');
  img.src = url;
  */
        })
        .catch(function(error) {});
    };
    /* GET CLOUD STORAGE END */
    /* SET CLOUD STORAGE */
    this.setCloudStorage = function(
      strStoragePath,
      blobFile,
      strDatabasePath,
      objItem,
      strProperty
    ) {
      console.log("objItem");
      console.log(objItem);
      console.log(strDatabasePath);
      var stRef = firebase.storage().ref(strStoragePath);
      var uploadTask = stRef.put(blobFile);
      // Listen for state changes, errors, and completion of the upload.
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED, // or 'state_changed'
        function(snapshot) {
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          var progress = snapshot.bytesTransferred / snapshot.totalBytes * 100;
          console.log("Upload is " + progress + "% done");
          switch (snapshot.state) {
            case firebase.storage.TaskState.PAUSED: // or 'paused'
              console.log("Upload is paused");
              break;
            case firebase.storage.TaskState.RUNNING: // or 'running'
              console.log("Upload is running");
              break;
          }
        },
        function(error) {
          // A full list of error codes is available at
          // https://firebase.google.com/docs/storage/web/handle-errors
          switch (error.code) {
            case "storage/unauthorized":
              // User doesn't have permission to access the object
              break;
            case "storage/canceled":
              // User canceled the upload
              break;
            case "storage/unknown":
              // Unknown error occurred, inspect error.serverResponse
              break;
          }
        },
        function() {
          console.log("upload completed");
          console.log("getting downloadURL");
          var stLink = uploadTask.snapshot.downloadURL;
          $ionicPopup.alert({
            title: "<span class='positive'>success</span>",
            template: "Upload completed"
          }); /*alert*/
          objItem[strProperty] = stLink;
          self.setCloudData(strDatabasePath, objItem);
        } /*upload completed*/
      ); /*uploadtaskon*/
    };
    /* SET CLOUD STORAGE END */
  })


  .service("ProfileService", function(
    $rootScope,
    $timeout,
    $q,
    $http,
    $ionicPopup,
    $ionicLoading,
    $localStorage,
    $firebaseAuth,
    $firebaseObject,
    FireService
  ) {
    var self = this;

    var dataFields = [
      "uid",
      "email",
      "displayName",
      "photoUrl",
      "photoData",
      "phoneNumber",
      "dataUpdate",
      "photoUpdate"
    ];
    this.data = { profile: {} };
    var hideIonicLoadingIfItIsShowing = function() {
      $ionicLoading._getLoader().then(function(state) {
        if (state.isShown == true) {
          $ionicLoading.hide();
        }
      });
    };
    /* GET LOCAL APP PROFILE */
    this.getAppProfile = function() {};
    /* GET LOCAL APP PROFILE END*/
    /* GET LOCAL APP PROFILE PHOTO*/
    this.getProfilePhoto = function() {};
    /* GET LOCAL APP PROFILE PHOTO */
    /* SET LOCAL APP PROFILE */
    this.setAppProfile = function(objAppProfile) {};
    /* SET LOCAL APP PROFILE END*/
    /* UPDATE APP PROFILE */
    this.updateAppProfile = function(objUser) {
      if (objUser != null) {
        var strDatabasePath = "Profiles/" + objUser.uid;
        FireService.getCloudData(strDatabasePath).then(function(objTest) {
          console.log("objTest");
          console.log(objTest);
          dataFields.forEach(function(field) {
            self.data.profile[field] = objTest[field];
          });
          console.log(self.data.profile);
          $localStorage.appProfile = self.data.profile;
        });
      } else {
        self.data.profile = {};
        $localStorage.appProfile = null;
      }
    };
    /* UPDATE APP PROFILE END*/
    /* INIT LOCAL APP PROFILE */
    this.initData = function() {
      var tmpLocalAppUser = $localStorage.appUser || {};
      var tmpLocalAppProfile = $localStorage.appProfile || {};
      console.log("tmpLocalAppProfile");
      console.log(tmpLocalAppProfile);
      if (
        Object.keys(tmpLocalAppProfile).length === 0 ||
        tmpLocalAppProfile === null
      ) {
        console.log("create");
        dataFields.forEach(function(field) {
          self.data.profile[field] = tmpLocalAppUser[field] || "";
        }); /*forEach*/
        $localStorage.appProfile = self.data.profile;
      } else {
        console.log("copy");
        dataFields.forEach(function(field) {
          self.data.profile[field] = tmpLocalAppProfile[field] || "";
        }); /*forEach*/
      } /*else*/
      FireService.getCloudStorage(
        "Profiles/" + tmpLocalAppUser.uid + "/photoUrl"
      );
    };
    /* INIT LOCAL APP PROFILE END*/
    /* SET CLOUD PROFILE */
    this.setCloudAppProfile = function(objUser) {};
    /* SET CLOUD PROFILE END*/
    /* SET DISPLAYNAME */
    this.setDisplayName = function(objUser) {
      var user = $firebaseAuth().$getAuth();
      if (user) {
        user
          .updateProfile({
            displayName: objUser.displayName
          })
          .then(function() {
            console.log("Update successful");
            hideIonicLoadingIfItIsShowing();
            //UserService.updateAppUser(objUser);
            self.setCloudAppProfile(objUser);
          })
          .catch(function(error) {
            // An error happened.
            hideIonicLoadingIfItIsShowing();
            $ionicPopup.alert({
              title: "<span class='assertive'>" + error.code + "</span>",
              template: error.message
            }); /*alert*/
          });
      } else {
        console.log("Logged out");
      }
    }; /*doUpdateDisplayName*/
    /* SET DISPLAYNAME END*/
    /* SET EMAIL */
    this.setEmail = function(objUser) {
      var user = $firebaseAuth().$getAuth();
      if (user) {
        user
          .updateEmail(objUser.email)
          .then(function() {
            console.log("update successful");
            hideIonicLoadingIfItIsShowing();
            //UserService.setAppUser(user);
            self.setCloudAppProfile(objUser);
          })
          .catch(function(error) {
            // An error happened.
            $ionicPopup.alert({
              title: "<span class='assertive'>" + error.code + "</span>",
              template: error.message
            }); /*alert*/
            hideIonicLoadingIfItIsShowing();
          });
      } else {
        console.log("Logged out");
      }
    }; /*doUpdateEmail*/
    /* SET EMAIL END*/

    /* SET PHOTO */
    this.setPhoto = function(objUser) {
      var user = $firebaseAuth().$getAuth();
      if (user) {
        var debug = { hello: "world" };
        var blobFile = new Blob([JSON.stringify(debug, null, 2)], {
          type: "application/json"
        });

        var strStoragePath = "Profiles/" + user.uid + "/photoUrl";
        var strDatabasePath = "Profiles/" + user.uid;
        var objItem = { uid: user.uid, photoUrl: "" };
        var strProperty = "photoUrl";

        FireService.getCloudData(strDatabasePath).then(function(objTest) {
          console.log("objTest");
          console.log(objTest);

          var objNewItem = {};

          dataFields.forEach(function(field) {
            objNewItem[field] = objTest[field];
          });
          objNewItem["dataUpdate"] = new Date().getTime();
          console.log(objNewItem);
          FireService.setCloudStorage(
            strStoragePath,
            blobFile,
            strDatabasePath,
            objNewItem,
            strProperty
          );
        });
      } else {
        console.log("Logged out");
      }
    }; /*doUpdateEmail*/

    /* SET PHOTO END*/

    this.prepViewProfile = function() {
      //self.updateLocalAppProfile();

      var newScope = $rootScope.$new();
      newScope.selectItem = function(strItem) {
        switch (strItem) {
          case "imgPerson":
            alert(strItem);
            break;
          case "displayName":
            alert(strItem);
            break;
          case "email":
            alert(strItem);
            break;
        }
        myPopup.close();
      };

      var viewCloudProfile = function(appProfile) {
        var newScope = $rootScope.$new();
        newScope.app = { profile: appProfile };

        var myPopup = $ionicPopup.show({
          template:
            "<p>Click to update</p>" +
            '<center><img src="' +
            (newScope.app.profile.photoData || defaults.images.imgPerson) +
            '" ng-click="selectItem(\'photoURL\')" /></center>' +
            '<button class="button button-full button-positive" ng-click="selectItem(\'displayName\')">Display Name:&nbsp;<span style="color:yellow"> ' +
            newScope.app.profile.displayName +
            "</span></button>" +
            '<button class="button button-full button-positive" ng-click="selectItem(\'email\')">Email:&nbsp;<span style="color:yellow">' +
            newScope.app.profile.email +
            "</span></button>",
          title: "<b>Login Profile</b>",
          scope: newScope,
          buttons: [
            {
              text: "Cancel",
              type: "button-assertive"
            }
          ]
        });
      };

      var appUser = firebase.auth().currentUser;
      if (appUser) {
        self.setPhoto(appUser);
        return;

        //console.log(appUser)
        $ionicLoading.show();
        var dbref = firebase.database().ref("Profiles/" + appUser.uid);
        var appProfile = $firebaseObject(dbref);
        appProfile.$loaded(function(data) {
          $ionicLoading.hide();
          self.copyLocalAppProfileFromCloudAppProfile(appProfile);
          viewCloudProfile(appProfile);
          appProfile.$destroy();
        }); /*loaded*/
      }
    }; /*prepViewProfile*/

    /*DO ACTION*/
    this.doAction = function(strCmd) {
      console.log(strCmd);
      switch (strCmd) {
        case "viewProfile":
          self.prepViewProfile();
          break;
      } /*switch*/
    }; /*doAction*/
  }) /*ProfileService*/

  .service("AuthService", function(
    $rootScope,
    $timeout,
    $q,
    $http,
    $ionicPopup,
    $ionicLoading,
    $localStorage,
    $firebaseAuth,
    $firebaseObject
  ) {
    var self = this; /*use self var to avoid internal conflict*/
    var hideIonicLoadingIfItIsShowing = function() {
      $ionicLoading._getLoader().then(function(state) {
        if (state.isShown == true) {
          $ionicLoading.hide();
        }
      });
    };
    /*DO SIGN UP*/
    this.doSignUp = function(objUser) {
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          var objAuthUser = $firebaseAuth()
            .$createUserWithEmailAndPassword(objUser.email, objUser.password)
            .catch(function(error) {
              // Handle Errors here.
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: "<span class='assertive'>" + error.code + "</span>",
                template: error.message
              }); /*alert*/
            }); /*createuserwithemailandpassword.catch*/
          //console.log(objAuthUser);
        }) /*setpersistence.then*/
        .catch(function(error) {
          // Handle Errors here.
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: "<span class='assertive'>" + error.code + "</span>",
            template: error.message
          }); /*alert*/
        }); /*setpersistence.then.catch*/
    };
    /*doSignUp*/
    /*DO SIGN IN*/

    this.doSignIn = function(objUser) {
      $ionicLoading.show({
        template: "Signing In ...",
        delay: 100
      });
      firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.LOCAL)
        .then(function() {
          var objAuthUser = $firebaseAuth()
            .$signInWithEmailAndPassword(objUser.email, objUser.password)
            .catch(function(error) {
              // Handle Errors here.
              $ionicLoading.hide();
              $ionicPopup.alert({
                title: "<span class='assertive'>" + error.code + "</span>",
                template: error.message
              }); /*alert*/
            }); /*signInWithEmailAndPassword.catch*/
          //console.log(objAuthUser);
        }) /*setpersistence.then*/
        .catch(function(error) {
          // Handle Errors here.
          $ionicLoading.hide();
          $ionicPopup.alert({
            title: "<span class='assertive'>" + error.code + "</span>",
            template: error.message
          }); /*alert*/
        }); /*setpersistence.then.catch*/
    };
    /*doSignIn*/
    /*DO SIGN OUT*/
    this.doSignOut = function(scope) {
      var confirmPopup = $ionicPopup.confirm({
        title: "Sign Out",
        template: "Are you sure?",
        cssClass: "popupCustom"
      });
      confirmPopup.then(function(res) {
        if (res) {
          //console.log("Confirmed Sign Out");
          $firebaseAuth().$signOut();
        } else {
          //console.log("Cancel sign Out");
        }
      });
    };
    /*doSignOut*/
    /*VERIFY ID TOKEN*/
    this.verifyIdToken = function() {
      //console.log('verifyIdToken')
      var verifiedToken = false;
      try {
        /*try getIdToken*/
        firebase
          .auth()
          .currentUser.getIdToken(/* forceRefresh */ true)
          .then(function(idToken) {
            //console.log('getIdToken:')
            //console.log(idToken)
            // Send token to backend via HTTPS
            // manual decode at jwt.io is also possible:
            // 1.get cert at https://www.googleapis.com/robot/v1/metadata/x509/securetoken@system.gserviceaccount.com
            // 2.check verified at jwt.io
            var url =
              "https://script.google.com/macros/s/AKfycbwGgYhJhIpQQi8wfyhdUHm5eupTxMRmsaq1aQlGs8kl4T1nKGEi/exec";
            var param = "?cmd=vfyidtoken&idtoken=" + idToken;
            //$ionicLoading.show();
            $http
              .get(url + param)
              .then(function(response) {
                if (response) {
                  //console.log(response);
                  if (response) {
                    if (response.data) {
                      verifiedToken = angular.fromJson(response.data.content);
                    }
                  }
                }
                console.log("Firebase Token Check:" + verifiedToken);
              })
              .catch(function(e) {
                console.log("Firebase Token Check:" + e);
              });
          })
          .catch(function(error) {
            // Handle error
          }); /*idToken*/
      } catch (error) {
        console.log(error);
      } /*try getIdToken*/
    };
    /*verifyidToken*/

    /*PREP USER SIGN UP*/
    this.prepUserSignUp = function() {
      var newScope = $rootScope.$new();
      newScope.popupData = {};
      var strPopup =
        '<form class="list" name="formSignUp"><input type="email" placeholder="Your Email" ng-model="popupData.email" ng-required="true" name="email"><div ng-hide="formSignUp.email.$valid" class="show-list-numbers-and-dots assertive">Enter valid email</div><br/><input type="password" placeholder="Your Password (min 6 chars)" ng-model="popupData.password" name="password" ng-required="true"><br/><input type="password" placeholder="Re-enter Password" ng-model="popupData.password1" name="password1" ng-required="true"><div ng-show="userNew.password!=userNew.password1" class="show-list-numbers-and-dots assertive"><p>Passwords must match one another</p></div><p name="formvalidity" style="display:none">{{formSignUp.$valid && (userNew.password==userNew.password1)}}</p></form>';
      var strPopupTitle =
        '<div style="text-align:center;"><i class="icon positive ion-planet" style="font-size:100pt;"></i></div>Sign Up';
      var strPopupSubTitle = "Enter Email and Password for Registration";
      return $ionicPopup.show({
        template: strPopup,
        title: strPopupTitle,
        subTitle: strPopupSubTitle,
        cssClass: "popupCustom",
        scope: scope,
        buttons: [
          {
            text: "Cancel",
            type: "button-assertive"
          },
          {
            text: "Sign Up",
            type: "button-calm",
            onTap: function(e) {
              var elem1 = document.querySelectorAll('[name="formvalidity"]')[0];
              if (elem1.innerHTML === "true") {
                $ionicLoading.show({
                  template: "Signing Up ...",
                  delay: 100
                });
                self.doSignUp(newScope.popupData);
                //scope.popupData={};
              } else {
                $ionicPopup.alert({
                  title: "<span class='assertive'>" + error.code + "</span>",
                  template: "Please complete the form"
                }); /*alert*/
                e.preventDefault();
              } /*if*/
            } /*onTap*/
          } /*button*/
        ] /*buttons*/
      }); /*show*/
      newScope.$destroy();
    };
    /*prepUserSignUp*/
    /*PREP USER SIGN IN*/
    this.prepUserSignIn = function() {
      var newScope = $rootScope.$new();
      newScope.popupData = {};
      var strPopup =
        '<form class="list" name="formSignIn"><input type="email" placeholder="Your Email" ng-model="popupData.email" ng-required="true" name="email"><div ng-hide="formSignIn.email.$valid" class="show-list-numbers-and-dots assertive">Enter valid email</div><br/><input type="password" placeholder="Your Password (min 6 chars)" ng-model="popupData.password" name="password" ng-required="true"><br/><p name="formvalidity" style="display:none">{{formSignIn.$valid}}</p></form>';
      var strPopupTitle =
        '<div style="text-align:center;"><i class="icon positive ion-planet" style="font-size:100pt;"></i></div>Sign In';
      var strPopupSubTitle = "Enter Email and Password";
      return $ionicPopup.show({
        template: strPopup,
        title: strPopupTitle,
        subTitle: strPopupSubTitle,
        cssClass: "popupCustom",
        scope: newScope,
        buttons: [
          {
            text: "Cancel",
            type: "button-assertive"
          },
          {
            text: "Sign In",
            type: "button-balanced",
            onTap: function(e) {
              var elem1 = document.querySelectorAll('[name="formvalidity"]')[0];
              if (elem1.innerHTML === "true") {
                //console.log(newScope.popupData)
                self.doSignIn(newScope.popupData);
              } else {
                $ionicPopup.alert({
                  title: "<span class='assertive'>" + error.code + "</span>",
                  template: "Please complete the form"
                }); /*alert*/
                e.preventDefault();
              } /*if*/
            } /*onTap*/
          } /*button*/
        ] /*buttons*/
      }); /*show*/
      newScope.$destroy();
    };
    /*prepUserSignIn*/
    /*PREP USER SIGN OUT*/
    this.prepUserSignOut = function(scope) {
      self.doSignOut();
    };
    /*prepUserSignOut*/
    /*DO ACTION*/
    this.doAction = function(strCmd) {
      //console.log(strCmd)
      switch (strCmd) {
        case "signIn":
          self.prepUserSignIn();
          break;
        case "signUp":
          self.prepUserSignUp();
          break;
        case "signOut":
          self.prepUserSignOut();
          break;
        case "verifyIdToken":
          self.verifyIdToken();
          break;
        case "viewProfile":
          alert(strCmd);
          break;
      } /*switch*/
    };
    /*doAction*/
  }) /*AuthService*/


  .service("UserService", function(
    $localStorage,
    $ionicHistory,
    $state,
    DefaultsFactory
  ) {
    var self = this;
    var dataFields = ["uid", "email", "displayName", "photoUrl", "phoneNumber"];
    this.data = {
      user: {},
      status: {
        isSignedIn: false,
        isSignedOut: true
      }
    };

    /*REDIRECT USER*/
    var redirectUser = function() {
      var defaults = DefaultsFactory.defaults;
      var targetPage = defaults.pages.guestPage;
      if (self.data.status.isSignedIn == true) {
        targetPage = defaults.pages.userPage;
      }
      //console.log(targetPage);
      $ionicHistory.nextViewOptions({
        disableAnimate: true,
        disableBack: true,
        historyRoot: true
      });
      if (targetPage != undefined) $state.go(targetPage);
    };
    /*REDIRECT USER END*/
    /* UPDATE APP STATUS */
    this.updateAppStatus = function(objUser) {
      //console.log('updateAppStatus')
      //console.log(objUser)
      if (objUser === null) {
        self.data.status.isSignedOut = true;
        self.data.status.isSignedIn = false;
      } else {
        self.data.status.isSignedIn = true;
        self.data.status.isSignedOut = false;
      }
      //console.log(self.status)
      redirectUser();
    };
    /* UPDATE APP STATUS END */
    /* UPDATE DELAYED APP STATUS */
    this.updateDelayedAppStatus = function(objUser) {
      //console.log(objUser)
      var firstProp, secondProp;
      if (objUser != null) {
        if (
          objUser.uid != null &&
          objUser.uid != "" &&
          objUser.uid != undefined
        ) {
          //console.log('switch from signOut to signIn')
          firstProp = "isSignedOut";
          secondProp = "isSignedIn";
        }
      } else {
        //console.log('switch from signIn to signOut')
        firstProp = "isSignedIn";
        secondProp = "isSignedOut";
      }
      self.data.status[firstProp] = false;
      $timeout(function() {
        self.data.status[secondProp] = true;
        redirectUser();
      }, 250);
    };
    /* UPDATE DELAYED APP STATUS END */
    /* GET LOCAL USER */
    this.getLocalUser = function() {
      return $localStorage.appUser;
    };
    /* GET LOCAL USER END */

    /* SET LOCAL USER */

    this.setLocalUser = function(objUser) {
      //console.log("setLocalUser");
      //console.log(objUser)
      var tmpAppUser = null;
      if (objUser != undefined && objUser !== null) {
        tmpAppUser = {};
        try {
          dataFields.forEach(function(field) {
            //console.log(field)
            tmpAppUser[field] = objUser[field] || "";
          });
        } catch (error) {
          console.log(error);
        }
      } /*if*/
      //console.log(tmpAppUser);
      $localStorage.appUser = tmpAppUser;
      self.updateAppStatus(tmpAppUser);
    };
    /* SET LOCAL USER END */

    /* INIT DATA */
    this.initData = function() {
      var tempUser = $localStorage.appUser;
      if ($localStorage.appUser) {
        self.data.user = $localStorage.appUser;
        //console.log('self.data.user');
        //console.log(self.data.user);
        self.updateAppStatus(self.data.user);
      }
    };
    /* INIT USER END */
    /* UPDATE APP USER */
    this.updateAppUser = function(objUser) {
      //console.log("updateAppUser");
      //console.log(objUser)
      self.data.user = objUser;
      self.setLocalUser(objUser);
    };
    /* UPDATE APP USER END */

    /* DO ACTION */

    this.doAction = function(scope, strCmd) {
      console.log(strCmd);
      /* DUMMY AUTH ACTIONS BEGIN 
      switch (strCmd) {
        case "signIn":
          self.updateAppUser({ uid: 1 });
          $state.go("menu.home");
          break;
        case "signUp":
          self.updateAppUser({ uid: 2 });
          $state.go("menu.home");
          break;
        case "signOut":
          self.updateAppUser(null);
          $state.go("welcome");
          break;
      }
      DUMMY AUTH ACTIONS END */
    };
    /* DO ACTION END */
  }) /*UserService*/

  .factory("DefaultsFactory", [
    function() {
      var imgLogo =
        "data:image/png;base64,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";
      /* http://flamingtext.com/logo/Design-Glow?fontname=great+vibes */
      var imgHeader =
        "data:image/png;base64,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";
      var imgPerson =
        "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAMgAAADICAQAAAAHUWYVAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAgY0hSTQAAeiUAAICDAAD5/wAAgOkAAHUwAADqYAAAOpgAABdvkl/FRgAAAAJiS0dEAP+Hj8y/AAAACXBIWXMAAAsTAAALEwEAmpwYAAASHUlEQVR42u2deXwURZvHvzMIIgp5RVARAeVKIiICSpTXFfAAQVjBF4Lci0DQEJCNEHZB4H25JEEWuQwQ9M3LaxDCIYuAyo2K3IJK4oQAcgi8IIdyI+DsH8JnUz2TSR9V3ZOkf/NPqif9dFV9u6ar63gerx/3E04fL67CSi4QF4grF4gLxJULxAXiygXiAnHlAnGBuHKBuHKBuEBcuUBcIK5cIC4QwBNen7KehzzNPR088Z6RnumeDzzpnrmeTE+mZ64n3fOBZ7pnpCfe097T3BPtKRteOS9qLSSC2rTjTd5iJKMYxVskEU9PetCJDnSgEz3oSTxJvMVoRjGSYbxJO2oT4f5kyVQdYpnKWvaRw2LeIYlYYoiiEmWC/n8ZKhFFDB0ZwjssJoe9rGYKsdRxgVhRdXqRho/dzCeBZtxl2lIFnqU/89mNj1n0oroLxJgeYygb2cdsehMp1XIkfZjNPjby3zRwgRSsmiSxlW2MpbHS6zRmHDvYzGBqukDyUzuWkEsyj9t2xRhSyOVj2rlARN1DEjks5iXdZ5zBxyZWkUEqk0lhDGNIYTKpZLCKTfg4o9tWWxaTw2DucYEARDOVHJKpXeB/HmEVU0jgOeoRSTSNaU5X4hnIEIYznCEMJJ6uNKcx0URSj+dJYAqrOFKg7dqkkMMUooo3kAdJJZuEAt4TtjOVbjxMVZrzBtNZw3f8XKDtn/mO1UznDZpTlbp0YzrbQ54RQX+ymc4DxRPIPUzDx2shq3QhvanF4wzgQ7L43fS1fmc3H5LA49QijoWczPc/PcSTw1TuLm5AkviBfpTK59tfySCW6nTgffZKve5e0uhADWLJ4Nd8/qcUCfgYXHyAvMgukrkzn2/X053qdGUB55Xl4CwL6Ep1XmVDPv9xJyns5MWiD6Qis1lGvaDfXSCVBjTjn5y2JS+n+TtNaUAqF4J+/yjLSKNiUQbyCtn0CvrNCUZTi3h22n5L7iSeWozJp5vQmyxeKZpAypDOR1QI8s1JkohiBMdwSscYTiRJnArapj8iPZ9hzEIM5Gmy6BHk+FVSqM0EA69xqnSGCUTyDleDfNeDLP6tKAEZxIagvft5PMyQMIBxU6cYTB0ygnzzAF+QWDSAePgHE4Ic300LOrEnbGDcVC5deZZvg3wzkXSd035hDOR+ttM9yPEx1GVl2MG4qbU8yuggx3uwjfsLM5DH2BFk1mEnMQwPWxg3NYIYdgUcbcgOGhZWIC35OsgQxFQasNWi5Yo8QRwTmMt6ssgl58Ynl2w2MJ+J9OMpKlu8ylbqMy3g6N18TYvCCKQzKyipOXaB9gywZPUJhrKWPWxiJoPoRBMeoia1b3xqEs3TxJLINL5kDxsZy/OWrtef2IDXxlJ8RufCBiQuSF9lG4+wyLTFaiTxDZsYSzP+pOuMMjRmKCvZwxgLyxsWUI8dAUcz6FOYgMQzM0gRGrHfpL1aTMNHMvVNnj2M3WTwlMmr7+Nx5gYcnUV8YQHyGtMDjo2jq0lrpRhFFv0obTFXnfmSdJN9JD9deDvg6HT6FgYg3UgNOPY6w0xaa8p3DA94FplVD3JCzsCE0tAgLWKG/GeJbCAvMifgWAdmmK6EdZKXAZUhlQ8pYercVDoEHMugVTgDeYRlAcdasdCktXTGokJd2GFyRnAhLwQcW0bdcAVSgTUBx57jU5PWlgUdjJSjemymkqkzP6eZ5oiHNRbWVCoFsjpgcL1VEET6tFTxbN2DbDa5BHt9QCupyOpwBPLPgHnAl023jsm0QbWq8rnJMz+nvebIo0GenA4D+c+Abm0cH5u01dPi27xexfC+yTMXBXR4u8nKs1dS0f5Hc2QsaSZtVeED7NKrtDZ55qyA95LJcpbAygDiCWgLmbxl2loGdmqO6RfOoQG9xyXhAiRd02PJoqNpWy/bNVV6Q3cGeQPXq1iyhfR9pIcDkHaaCajrtLRgbTJ2a6DJDjD4acl14UgPA8vFFQG5LaB/0Y7Dpq11UT0fF1QjTJ95iJc1R+Zwm7NA0rhDSKfyiQVrw3BCvXQO5wfTUs3IXbkg49w2AmlGFyH9o6Uh6SeJdgRIyaCz/noVzz4h3Y0mzgHR9uOt7UTqjlPqYunstpq0pW67FSADeVBIJwddPKNXHv7dMSCNqGbh7N2ME9LVrbwkmgcSocnGQf7LUqU05D6cU3NLZw/jRyH9NuXsBzJG05+w+oPTBCf1tMXzxdKXYYzdQO4lQUh/whcWi/SYo0DqWTz/K5YK6QSze7DMAtHeAa9ZrpLaOCnr/lBeF1Ies23EHJAqml0e4zlqsTglLS9rs6ZbLb+SHiVZSPcxZ9EckCFC6jKjLFdIeZmzbqZ0r2ULo7gspJPsAhJBb037uGS5MBHc4jAQ6y6cLjJe00ZM9LXMAOnHrXlSZ0mRUB3OOzCQsdEghbN5UqXNjFuYqYiBQmqKhPYBVxwH8psEG5eYIqRNbPExDqSNsC/1d96VUh0nhHvLCR2XYuVdwb1BReMzksaB9BNSc4JulDSuCxx0FMc1zbu2WZ3STEf0Uw2kmmZvxERpVeLs5rZ9Oryn6JO4uuAFqqoFIq4t2c5uaVWS6ygQeVf/nm+EtMGRZKNAxNny6RKrZD9OSuYP5ntCyqDbAWNAIoV1rJdYEKZVYlwHJNrKFF4QHzE2KGQMSCchtTQfHyHmdBwndUSirXOaaWxDa3CMAWmluRNk6oyj7yI/S7U2T0gZWqVsBMh9wtq8syyXWogTNvkACq6TUq0tF96qGhkZJzMC5DkhtUryHX3ZQSCXJb1N3dQVVuVJeXjWHiCydQqn9Iv0m0GsHQNbs40A+bOQku8YQ50HuYJ0iYuSLa4MUXOSgDwoeEzfLWmoIa8u4JQu45ds8Ufhlbmmfk+n+oE8KaS+UlAtzrUQFbfCRiH1hHwgMUJqi4IiONftvazA5mbVQOqGuJwcKfdFla9UzFZuDlF7EoDcIjjhPoZPQRGcC7dS07KfiED5+FeeVJRe6HqBVBd2UWQrqJRapn2RWFcFJctYs/L8fZ9m2a1lIA/leylZaouTekmBzewQNWgZyAMhLiVH9kUNCaZHlAPRuZxbH5CyVBHSKuYunFxqDZUUPEXEWqqi2dpkCUhVzUTkEQVVchtOqrSC6x/RtBBdk7n6gFQWGtwvSnxQX3MUyFUF1z8mxF+opm+xrD4gd1FeuJAK18e/OgrkFwVv66eFG1fnYll9QMoLv3+/KKkS5zy/Axy3EC5G3012u3BTW24hZZUDOeAokENKrOb9JYmQ2ULuEqIDnFSS+SyclE+J1bw1VUYmkNuFlJpFn84CUXN1saZ0hbzQB0Qch7mq6B49inPaocSqWFOl5AG5VUj9piTz19nmGI79kkOP3dQVe4Comrf42jEgWxTZvRKiFi0BEeVXlP3PcUqrCBvpA2Ki6ZnQt4o6nwVLVSQTE78s4QQE0x5+rWmDkrE50HaGdD179QG5FoK7TM3BCf1DmeXSqoCI4zwRygrwrQNxDM8HiXwgS2JN6Vr7pQ/IKcFYedRpLHZrisLVLncKN7WulZl6gZy1pYXAIo07MNW6KmVTd376U56/z8kEclpYxKbW58KrtgIZpHDY3yPU1Dl964f1ATkpGKuk9EfrCxnOVnVqm2ZfuVyVF7YhnNY3KKsPyBFhw1mE4gjKPRWsGw6m84p92FUUftwP6utc6wNySPPKptqZ61pbgOQIS9nkq0rIOrQE5LzGF2+U4qqyZ4u06p3xYmygw/omifWOZYl7ZGspLsq32KFvFNsXa+mAvpP0AsmytYVs07jwVqOtiu2LLUTn4kK9QH4Upo8eNRlWS69OKZowyqvzioGUEKIuHtHbUdEL5Bo5eVL3SI6dFij1j/UvlewKyds+8rrB9Olt8/rnQ74XUvVRq6XKgaxQbL9+iNqTAmSTkFK9dWCT4mVBfhYrLoFYQ7o3OOkHIppU7/ZY7dzIOuVLKpqEuJ2lADkgDPtFG/UDZVhqQx/NVZz7akKkh1z9c6FG5tTFRQjNFRdpl8Ke1iWNNxL5ej5EzUkDIs48t0a1JimzPFv5nvjWIWpOGpDVwoLkZxVscRE1X9GiVXhHcc5LC95NrhuJBGoEyL+EV6k7LAX/0qNrih7sHytf3dJK2C2wlRNqgKBxyNQZ1VqjxOo05fkWHb0tM3KqMSDio7CNvl1zFqRikPGw8lGAsppIvoY6EMaA7BVWhdxKrOKiHVOwFyUT1YoVFkrtMLZF1uhSUpF2vOKinVewhG0lqiXWynxjJxsF8pGQasjDigsn26nZFXYpznFdGuRJ+TU1Jh3IYc2DfbDi4sne+nDYSI/HlMQaWc5PaoFo3QR3pUKhAqLajWAFjSfr94waMA5kheBS1as4GL3smcPfUasBQo2e4FP1QLQO+BOVdn5LhLk9UXdoIoaYGBEwAyRVWA17O4MUFlG2U7NSqNSbwvbYy8ywB8hZ0oR0kkI/JbKD6VU3HT29YJXWPNBncc4eIGiCX91mPq5lCEWTwFpqSLZaju+YSUclXZHRmu3jyWaMmANyhFlCOlFqFMInGMZmsplKMwXVVoE45nGA5bwqOL61qns1P90zzM1Jmo2ONlzTX0mVUqimJLOLTYzR+ECVr9tpxfv4WMEbkpb9iR3c64wwZ8YskBOaMdM2GkfkRtWYyWSzjiTLUWmNqCQteZc9rGeQXp+I+d5KYiz5KWbjLZiPHzhMs0Ur3aSdJxlPNhsZIMxC26smTGAP6xlgOq66WPoLDDebFfNAzmv6FJUN70VqwF/ZwdcMcRDF/+sWmjCZXFbyhuGuxBgNyDfNTxFbibD5nmaV+mAa6jyzBoPZwg5GCgNx4aCSPM+77GUNfXV3kOsxTEjnMNN8BqyFPO2lSRc811COznyKjxQahRkKUc8wAx8f8xdNVzaYFhRQKzYC+ZL3hXT1EPdGCVozhwNk8ILjgYj1qRxtWchB5vBSiL35qZpeWprGDb+tQCBe4xMqjvZB/qs+48nlE7oJG4ULh+6iG0vYy5SgUUDa8pqQ/pUEa5ezCuQ3umuOzBPWNN5NHBv4hiEWu5VO63768xXbSRLaQ+WA+cDuVicMrIfN/l/Nz1YJVt6w2pTZ7GUmTxdqFHnVkGR8LCH2xpNlpWawcrb1Vfsy4pj31qxziuRDOrKVdfQSnGcWDXl5ifnk8FcWaPy5H6SPDPMy1FaT7sQ8h325q1ZlRgY8LaU49JcDZCd9i3T161EfOavIvJKyM4vZxRpHmqzye6VlqY/ybcbhq+3EyTLllZit5xx2F+6Ujlkc6VYG5AxNFfn0DWf9RhOZHoW8UjO3hxbFDkgLuY5AvJKzt46/FCsc7Vgv16BXehYX2+yCzEn9B0tkm/QqyObfi8lbSZwKf6ZeJVmdRc9i0DrSVJj1KspuetBh+KKj9qq8/XqVZXkRLbhUJGFcpDmLVBn3Ksz4SmKM7o4oBPqJGJXO+71KM/89jzkYFUSFttJQCF1fyIDAcRqpefg5ojRiVO/A8tpQjDj6Fwkc/eQNIToLBKbxlOCRrvAphz8b354WvkBgIw+b2b4SJnqPOnYFZPLaVqhrvM4rhbDX9RMd6WeLl1SbgQDMp46kjQt2to1MOy/otbmAZ4mnpXKPuXK0mRfopyiMZtgAAfiMGAYo38BvTcfpz5NOxI3zOlTgqUQzUbHnXLO6xEQessGJU1gBgdMMIpJJyrfyG9M1JhLJIH3BV4oWEIBDJFKHSc4VX3OLTKIOgzSRIIoVEAAfiUSSqDx4RGjtIZHajuciLIAAnGQSkbRkrsKIafnpMnNpSSSTlDumKURA/tBndKE2Q2QvGwihdSQRSRc+C59KCCcgAIdIoRl1GMY6hX2wy6xjKNE8wwTH4u8WEiB/KJtxPEMNOjKbHIk/Y1fIIY2O1OAZ3sYXjkUPTyB/6CiZ9CGKSDoyleUWQk7msoypdCSSKOLIVO6Iv4gCuamDZDKA1kRRg9YMZBzz2MIPHM3H2845jvADW5jHOAbyIjWIog0DyNRE0nKBWNQ19rOcyYzlbwxnBKNIZhKzSGceS1jCPNKZxSTGM5oRDOdvjGUyK9gfZi+f1oH4w+tz0e/zr/Iv9M/0j/Un+vv6e/o7+dv52/k7+Xv6+/oT/eP8M/0L/av8Pv/F8Mp5UWshxUIuEBeIKxeIC8SVC8QF4soF4gJx5QJxgbhygbhygbhAXLlAXCCuXCBFXf8HBUhhFCCOIgQAAAAldEVYdGRhdGU6Y3JlYXRlADIwMTgtMDUtMjdUMjE6MzQ6MjUrMDA6MDBomW9OAAAAJXRFWHRkYXRlOm1vZGlmeQAyMDE2LTA4LTExVDA0OjAyOjQ5KzAwOjAwjCQLJgAAAABJRU5ErkJggg==";

      var defaults = {
        images: {
          imgLogo: imgLogo,
          imgPerson: imgPerson
        },
        pages: {
          guestPage: "welcome",
          userPage: "menu.home"
        }
      };

      return {
        defaults
      };
    }
  ])

/*CODE END */
;

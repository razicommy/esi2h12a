    angular.module('firebaseConfig', ['firebase'])
      .run(function() {
        // Initialize Firebase
  var config = {
    apiKey: "AIzaSyC0wS61Dg-L05YPnlP5V2e7nIe21lpmT6g",
    authDomain: "nimtcproject2.firebaseapp.com",
    databaseURL: "https://nimtcproject2.firebaseio.com",
    projectId: "nimtcproject2",
    storageBucket: "nimtcproject2.appspot.com",
    messagingSenderId: "703572705744"
  };
        firebase.initializeApp(config);
      })
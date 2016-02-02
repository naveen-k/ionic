// Ionic Starter App

angular.module('starter', ['ionic','ngCordova'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
  // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
  // for form inputs)
    //if(window.cordova && window.cordova.plugins.Keyboard) {
    //  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    //}
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('DeviceController', function($ionicPlatform, $scope, $cordovaDevice, $cordovaGeolocation,$cordovaDeviceMotion) {
  $ionicPlatform.ready(function() {
    $scope.$apply(function() {
      console.log('DeviceController','ionicPlatform ready');
      // sometimes binding does not work! :/
      // getting device infor from $cordovaDevice
      var device = $cordovaDevice.getDevice();
      console.log('DeviceController','device',device);
      $scope.manufacturer = device.manufacturer;
      $scope.model = device.model;
      $scope.platform = device.platform;
      $scope.uuid = device.uuid;


      // Get GEO info
      var posOptions = {timeout: 10000, enableHighAccuracy: false};
      $cordovaGeolocation.getCurrentPosition(posOptions)
      .then(function (position) {
        $scope.latitude  = position.coords.latitude
        $scope.longitude = position.coords.longitude
      }, function(err) {
        $scope.latitude=0;
        $scope.longitude=0;
      });

      var watchOptions = {
        timeout : 3000,
        enableHighAccuracy: false // may cause errors if true
      };

      var watchGeo = $cordovaGeolocation.watchPosition(watchOptions);
      watchGeo.then(null,
        function(err) {
          // error
        },
        function(position) {
          $scope.latitude  = position.coords.latitude
          $scope.longitude = position.coords.longitude
        });


       $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {
        $scope.xAxis = result.x;
        $scope.yAxis = result.y;
        $scope.zAxis = result.z;
        $scope.timeStamp = result.timestamp;
        }, function(err) {
      // An error occurred. Show a message to the user
      });



      // watch Acceleration
      var options = { frequency: 2000 };

      // Get Acceleration info
      var watchAcceleration = $cordovaDeviceMotion.watchAcceleration(options);
      watchAcceleration.then(null,function(error) {
      // An error occurred
      },
      function(result) {
        $scope.xAxis = result.x;
        $scope.yAxis = result.y;
        $scope.zAxis = result.z;
        $scope.timeStamp = result.timestamp;
      });  

    });
  });
})
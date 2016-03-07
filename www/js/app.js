// Ionic: starter
angular.module('starter', ['ionic', 'ngCordova', 'ngStorage'])


// Run Block
.run(function($ionicPlatform, $rootScope) {
    $ionicPlatform.ready(function() {
        // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
        // for form inputs)
        //if(window.cordova && window.cordova.plugins.Keyboard) {
        //  cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        //}
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    // Define UniqueID if exist (from localstorage)
    if (window.localStorage.device_id !== null) {
        $rootScope.device_id = window.localStorage.device_id;
    }
})

// Config Block -- Routing
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('list', {
            url: '/',
            templateUrl: 'main.html',
            controller: 'ListCtrl as vm'
        })
        .state('setting', {
            url: '/setting',
            templateUrl: 'setting.html',
            controller: 'SettingCtrl as vm'
        });
    $urlRouterProvider.otherwise("/");
})

// Start Animation Splash Page
.controller('ListCtrl', function($scope) {
    var vm = this;
    $scope.$on('$ionicView.afterEnter', function() {
        setTimeout(function() {
            document.getElementById("custom-overlay").style.display = "none";
        }, 3000);
    });
})

// Settings Controller
.controller('SettingCtrl', function($scope, $window, $stateParams, $ionicHistory, $localStorage, $rootScope) {
    var vm = this;
    // vm.randomGenerate = randomGenerate;
    vm.IDchange = IDchange;
    vm.device_id = window.localStorage.device_id;

    // Trackes the change if user edits'
    function IDchange() {
        console.log("vm.device_id Change", vm.device_id);
        window.localStorage.device_id = vm.device_id;
        $rootScope.device_id = window.localStorage.device_id;
        // }
    }

    $scope.goBack = function() {
        $ionicHistory.goBack();

    };


    $scope.frequency = $window.localStorage['frequency'];
    if (!$scope.frequency) {
        $window.localStorage['frequency'] = 5000;
        $scope.frequency = $window.localStorage['frequency'];
    }

    $scope.RadioChange = function(h) {
        $scope.frequency = h;
        $window.localStorage['frequency'] = h;
    };
    // set localStorage when function is called after a value is changed 
})


// 
.controller('DeviceController', function($ionicPlatform, $localStorage, $sessionStorage, $window, $scope, $state, $cordovaDevice, $cordovaDeviceOrientation, $cordovaGeolocation, $cordovaDeviceMotion, $cordovaBrightness, $cordovaHeadsetDetection) {
    var vm = this;
    vm.randomGenerate = randomGenerate;

    /////////
    $ionicPlatform.ready(function() {
        // $cordovaSplashscreen.hide();
        $scope.$apply(function() {
            console.log('DeviceController', 'ionicPlatform ready');
            // sometimes binding does not work! :/
            // getting device infor from $cordovaDevice

            // $scope.device_id = 'dweet_' + $cordovaDevice.getPlatform() + '_' + $cordovaDevice.getVersion();
            if (window.localStorage.device_id !== undefined) {
                vm.device_id = window.localStorage.device_id;

            } else {
                vm.device_id = randomGenerate(11);
                window.localStorage.device_id = vm.device_id;
            }


            /////////
            var osVersion = $cordovaDevice.getVersion();
            $scope.osVersion = osVersion;
            console.log('DeviceController', 'osVersion', osVersion);

            // Read   Brightness  
            var myVar = setInterval(myTimer, 500);

            function myTimer() {
                $cordovaBrightness.get().then(function(result) {
                    $scope.brightness = Math.round(result * 100) + '%';
                }, function(err) {
                    $scope.brightness = err;
                });
            }
            // get headphibe status
            //$scope.test=$cordovaHeadsetDetection
            // Read   Brightness  
            var myVarhead = setInterval(myHPTimer, 1000);

            function myHPTimer() {
                try {
                    $cordovaHeadsetDetection.detect().then(function(result) {
                        if (result) {
                            $scope.isHeadphone = 'Yes';
                        } else {
                            $scope.isHeadphone = 'No';
                        }
                        $scope.test = '#' + result;
                    }, function(err) {
                        $scope.isHeadphone = 'na';
                        //$scope.test='*'+err;
                    });
                } catch (err) {
                    $scope.isHeadphone = 'na';
                    //$scope.test='**'+err;
                }
            }

            // Get GEO info
            var posOptions = {
                timeout: 10000,
                enableHighAccuracy: false
            };
            $cordovaGeolocation.getCurrentPosition(posOptions)
                .then(function(position) {
                    $scope.latitude = position.coords.latitude.toFixed(7);
                    $scope.longitude = position.coords.longitude.toFixed(7);
                    $scope.altitude = position.coords.altitudeAccuracy + 'm';
                }, function(err) {
                    $scope.latitude = 0;
                    $scope.longitude = 0;
                    $scope.altitude = 0;
                });

            var watchOptions = {
                timeout: 3000,
                enableHighAccuracy: false // may cause errors if true
            };

            var watchGeo = $cordovaGeolocation.watchPosition(watchOptions);
            watchGeo.then(null,
                function(err) {
                    // error
                },
                function(position) {
                    $scope.latitude = position.coords.latitude.toFixed(7);
                    $scope.longitude = position.coords.longitude.toFixed(7);
                    $scope.altitude = position.coords.altitudeAccuracy + 'm';
                });


            // Read   Acceleration  
            $cordovaDeviceMotion.getCurrentAcceleration().then(function(result) {

                $scope.xAxis = result.x.toFixed(4) + 'G';
                $scope.yAxis = result.y.toFixed(4) + 'G';
                $scope.zAxis = result.z.toFixed(4) + 'G';
                $scope.rotationRateX = 0 + 'rad/s';
            }, function(err) {
                // An error occurred. Show a message to the user
                $scope.xAxis = 0;
                $scope.yAxis = 0;
                $scope.zAxis = 0;
                $scope.rotationRateX = 0 + ' rad/s';
            });

            // watch Acceleration
            var options = {
                frequency: 1000
            };
            // Get Acceleration info
            var watchAcceleration = $cordovaDeviceMotion.watchAcceleration(options);
            watchAcceleration.then(null, function(error) {
                    $scope.xAxis = 0;
                    $scope.yAxis = 0;
                    $scope.zAxis = 0;
                    $scope.rotationRateX = 0 + ' rad/s';
                },
                function(result) {
                    $scope.xAxis = result.x.toFixed(4) + 'G';
                    $scope.yAxis = result.y.toFixed(4) + 'G';
                    $scope.zAxis = result.z.toFixed(4) + 'G';
                    $scope.rotationRateX = 0 + ' rad/s';
                });

        });
        // Dweet  
        //var device_id=  'dweet_'+$cordovaDevice.getPlatform()+'_'+getUUID();
        var interval = $window.localStorage['frequency'];
        if (!interval) {
            interval = 1000;
        }
        var myVar = setInterval(dweetIt, interval);

        function dweetIt() {
            //$scope.test='hiii'+dweetio;
            var data = {
                osVersion: $scope.osVersion,
                latitude: $scope.latitude,
                longitude: $scope.longitude,
                altitude: $scope.altitude,
                xAxis: $scope.xAxis,
                yAxis: $scope.yAxis,
                zAxis: $scope.zAxis,
                rotationRateX: $scope.rotationRateX,
                brightness: $scope.brightness,
                isHeadphone: $scope.isHeadphone
            };

            // Apply Devise ID
            dweetio.dweet_for($scope.device_id, data, function(err, dweet) {
                //$scope.test=dweet.content;
            });
        }

        function deltaRotationVector(xAxis, yAxis, zAxis) {
            //$scope.test='hiii'+dweetio;

        }

    });

    function randomGenerate(x) {
        var me = this;
        // me.chars = RandString(/([A-Za-z])/ig);
        me.chars = "ABCDEFGHIJKLMNOPQRSTUVWXTZabcdefghiklmnopqrstuvwxyz";
        me.string_length = x / 2;
        me.randomstring = '';
        me.randomstring1 = '';
        me.randomstring2 = '';

        for (var i = 0; i < me.string_length; i++) {
            me.rnum = Math.floor(Math.random() * me.chars.length);
            me.randomstring1 += me.chars.substring(rnum, rnum + 1);
        }

        for (var i = 0; i < me.string_length; i++) {
            me.rnum = Math.floor(Math.random() * me.chars.length);
            me.randomstring2 += me.chars.substring(rnum, rnum + 1);
        }
        me.randomstring = me.randomstring1 + "_" + me.randomstring2;
        return me.randomstring;
    }


    $scope.changePage = function() {
        /* $location.path('/tab/newpost'); */
        /* this variant doesnt work */
        $state.go('setting');
    };
    $scope.share = function() {
        /* $location.path('/tab/newpost'); */
        /* this variant doesnt work */

        alert("Commng soon!");
        //$state.go("settings");
    };

});
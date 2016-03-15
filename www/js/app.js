// Ionic: starter
angular.module('starter', ['ionic', 'ngCordova', 'ngStorage'])

// Run Block
.run(function($ionicPlatform, $rootScope, $localStorage) {
    $ionicPlatform.ready(function() {
        // localStorage.clear();
        if (window.StatusBar) {
            StatusBar.styleDefault();
        }
    });

    // Define UniqueID if exist (from localstorage)
    if (window.localStorage.device_id !== undefined || null) {
        $rootScope.device_id = window.localStorage.device_id;
        // window.localStorage.UID = $rootScope.device_id;
    }
    if (window.localStorage.frequency === undefined || null) {
        window.localStorage.frequency = 5000;
        $rootScope.frequency = 5000;
    } else {
        $rootScope.frequency = window.localStorage.frequency;
    }
})

// Config Block -- Routing
.config(function($stateProvider, $urlRouterProvider) {

    $stateProvider
        .state('list', {
            url: '/',
            templateUrl: 'main.html',
            controller: 'ListCtrl'
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
    vm.madeChange = madeChange;
    vm.device_id = window.localStorage.device_id;

    // Trackes the change if user edits'
    function IDchange() {
        window.localStorage.device_id = vm.device_id;
        $rootScope.device_id = vm.device_id;
        vm.madeChange();
    }

    function madeChange() {
        if (vm.device_id === undefined) {
            $rootScope.device_id = window.localStorage.UID;
            window.localStorage.device_id = window.localStorage.UID;
        }
    }

    $scope.goBack = function() {
        $ionicHistory.goBack();
    };

    $scope.RadioChange = function(dweetFreq) {
        $scope.frequency = dweetFreq;
        window.localStorage.frequency = dweetFreq;
    };
})

// 
.controller('DeviceController', function($http, $ionicHistory, $rootScope, $ionicPlatform, $localStorage, $sessionStorage, $window, $scope, $state, $cordovaDevice, $cordovaDeviceOrientation, $cordovaGeolocation, $cordovaDeviceMotion, $cordovaBrightness, $cordovaHeadsetDetection) {
    var vm = this;
    vm.random_ID_Generator = random_ID_Generator;
    $scope.clickBack = clickBack;
    var interval = window.localStorage.frequency;

    function clickBack() {
        window.localStorage.UID = window.localStorage.device_id;
        $ionicHistory.goBack();
    }

    /////////
    $ionicPlatform.ready(function() {
        // $cordovaSplashscreen.hide();
        $scope.$apply(function() {

            
            if (window.localStorage.device_id !== undefined) {
                $rootScope.device_id = window.localStorage.device_id;
                window.localStorage.UID = $rootScope.device_id;
            } else {
                vm.random_ID_Generator();
            }

            /////////
            // Get OS Version from the device. 
            $scope.osVersion = $cordovaDevice.getVersion();
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
                        $scope.isHeadphone = 'NA';
                    });
                } catch (err) {
                    $scope.isHeadphone = 'NA';
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

        // function deltaRotationVector(xAxis, yAxis, zAxis) {

        // }

        // Watch change in Dweet Interval
        $scope.$watch(function() {
            var me = window.localStorage.frequency;
            return me;
        }, function(me) {
            interval = me;
            $scope.frequency = window.localStorage.frequency;

            // Clear privious Dweet before initiating another 
            if ($rootScope.timer_id) {
                clearInterval($rootScope.timer_id);
            }
            // Initiating a new Dweet.
            $rootScope.timer_id = setInterval(dweetNow, me);

            // Dweeting
            function dweetNow() {
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
                    console.log("Error Dweeting:", dweet.content);
                });
            }
        });

    });

    // Generates Random ID with data.json
    function random_ID_Generator() {
        var me = this;
        me.randomNoGen = randomNoGen;
        me.data = null;
        me.ID1 = null;
        me.ID2 = null;
        me.ID = null;

        // Get data from Data.json file.
        $http({
            method: 'GET',
            url: './js/data.json'
        })

        // Fetch Data
        .then(function successCallback(response) {
            // console.log("response", response.data);
            me.data = response.data;
            // this callback will be called asynchronously
            // when the response is available
        }, function errorCallback(error) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            console.log("error", error);
        })

        // Generate Random ID
        .then(function() {
            var A = me.data.adjectives;
            var N = me.data.nouns;
            var V = me.data.verbs;
            me.ID1 = vm.randomNoGen(0, A.length);
            me.ID2 = vm.randomNoGen(0, N.length);
            me.ID = A[me.ID1] + '_' + N[me.ID2];
            $rootScope.device_id = me.ID;
            window.localStorage.device_id = $rootScope.device_id;
            window.localStorage.UID = $rootScope.device_id;
        });

        function randomNoGen(min, max) {
            // Returns a random integer between min (included) and max (included)
            return Math.floor(Math.random() * (max - min + 1)) + min;
        }
    }

    $scope.changePage = function() {
        $state.go('setting');
    };
    $scope.share = function() {
        alert("Commng soon!");
    };

});
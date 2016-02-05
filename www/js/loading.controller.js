angular.module('starter', ['ionic'])
.controller('timeController', function($scope, $timeout) {
  $scope.isLoading = false;
  $scope.loadTime = 8000;

  $scope.startLoading = function() {
    $scope.isLoading = true;
  };

  $scope.stopLoading = function() {
    $scope.isLoading = false;
  };

  $scope.simulateAsync = function() {
    $scope.isLoading = true;

    $timeout(function() {
      $scope.isLoading = false;
    }, $scope.loadTime);

  };

});

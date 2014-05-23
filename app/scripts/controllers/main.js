'use strict';

angular.module('ceSlider')
  .controller('MainCtrl', function ($scope) {
    $scope.testData = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    $scope.lowValue = 0;
    $scope.highValue = 10;
  });

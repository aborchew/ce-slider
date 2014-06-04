'use strict';

angular.module('ceSliderApp')
  .directive('ceSlider', function ($rootScope, $timeout) {
    return {
      template: '<div></div>',
      restrict: 'E',
      scope: {
        'data': '=ceData',
        'value': '=ceValue',
        'step': '@ceStep',
        'node': '@ceNode'
      },
      link: {
        pre: function preLink(scope, element, attrs) {
          
        },
        post: function postLink(scope, element, attrs) {

          if(!Array.isArray(scope.data)) {
            throw new Error('A valid data model of type Array must be declared.');
          }

          if(!attrs.ceValue || !angular.isDefined(attrs.ceValue)) {
            throw new Error('A value model must be declared.');
          }

          var values = function () {
            var vals = [];
            angular.forEach(scope.data, function (item) {
              var val = $rootScope.getAttr(item, scope.node);
              if(vals.indexOf(val) == -1) {
                vals[vals.length] = val;
              }
            })
            return vals.sort();
          }();

          scope.min = Math.min.apply(null, values);
          scope.max = Math.max.apply(null, values);

          if(scope.min >= scope.max) {
            throw new Error('Data range must include at least two unequal values.');
          }

          if(!angular.isDefined(scope.step)) {
            console.log(scope.min, scope.max, 'no step!');
          }

          if(scope.max - scope.step <= scope.min) {
            throw new Error('The step supplied must be less than the difference between the minimum and maximum values.');
          }

        } 
      }
    };
  });
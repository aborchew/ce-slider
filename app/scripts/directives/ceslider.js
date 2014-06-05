'use strict';

angular.module('ceSliderApp')
  .directive('ceSlider', function ($timeout) {
    return {
      restrict: 'E',
      replace: true,
      templateUrl: 'partials/template.html',
      scope: {
        'data': '=ceData',
        'value': '=ceValue',
        'step': '@ceStep',
        'node': '@ceNode'
      },
      link: {
        pre: function preLink(scope, element, attrs) {

          if(!Array.isArray) {
            Array.isArray = function(arg) {
              return Object.prototype.toString.call(arg) === '[object Array]';
            };
          }

          scope.getAttr = function(object, string, splitter) {

            if (!string) return object;

            var splitter = splitter || '.';

            return string.split(splitter).reduce(function (pV, cV) {
              return pV[cV];
            }, object);

          }
          
        },
        post: function postLink(scope, element, attrs) {

          var rangeLength
            ;

          if(!Array.isArray(scope.data)) {
            throw new Error('A valid data model of type Array must be declared.');
          }

          if(!attrs.ceValue || !angular.isDefined(attrs.ceValue)) {
            throw new Error('A value model must be declared.');
          }

          var values = function () {
            var vals = [];
            angular.forEach(scope.data, function (item) {
              var val = scope.getAttr(item, scope.node);
              if(vals.indexOf(val) == -1) {
                vals[vals.length] = val;
              }
            })
            return vals.sort();
          }();

          function fixFloat(x) {
            return Math.round((x) * 1e12) / 1e12;
          }

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

          scope.steps = [];
          rangeLength = fixFloat(scope.max - scope.min);

          for(var i = scope.min; fixFloat(i) <= rangeLength; i += fixFloat(scope.step)) {
            scope.steps[scope.steps.length] = fixFloat(i);
          }

        } 
      }
    };
  });
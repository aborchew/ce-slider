'use strict';

angular.module('ceSlider')

  .directive('ceSlider', function () {
    return {
      templateUrl: '/partials/ceSlider.html',
      restrict: 'E',
      scope: {
        'model': '=ceModel',
        'modelMax': '=ceModelMax',
        'data': '=ceData',
        'type': '@ceSliderType'
      },
      link: function postLink(scope, element, attr) {

        var handles = function () {
          var hndls = [];
          var els = element.children().children();
          for(var i = 0, len = els.length; i < len; i++) {
            if(angular.element(els[i]).attr('drag-handle')) {
              hndls[hndls.length] = (els[i]);
            }
          }
          return hndls;
        }();

        scope.container = angular.element(element.children()[0]);
        scope.handle = angular.element(handles[0]);
        scope.minPossible = Math.min.apply(null, scope.data);

        if(scope.type != 'range') {
          scope.handleMax.remove();
        } else {
          scope.handleMax = angular.element(handles[1]);
          scope.maxPossible = Math.max.apply(null, scope.data);
        }

      }
    };
  })
  
  .directive('dragHandle', function ($document) {
    return {
      restrict: 'A',
      scope: {
        'type': '@dragHandle'
      },
      link: function postLink(scope, element, attr) {

        var startX = 0
          , x = 0
          ;

        if(scope.type == 'max') {
          element.css({
            left: '100%'
          });
          x = element[0].offsetLeft;
        }

        element.on('mousedown', function(event) {
          event.preventDefault();
          startX = event.screenX - x;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
        });

        function calcX(x) {
          return x / scope.$parent.container[0].clientWidth * 100;
        }

        function unCalcX(x) {
          return x * scope.$parent.container[0].clientWidth / 100;
        }

        function mousemove(event) {

          var tempX = event.screenX - startX;

          if(calcX(tempX) >= 0 && calcX(tempX) <= 100) {

            var minL = unCalcX(scope.$parent.handle.css('left').replace('%',''));
            var maxL = unCalcX(scope.$parent.handleMax.css('left').replace('%',''));

            if(scope.type == 'min' && tempX <= maxL) {
              x = tempX;
            } else if(scope.type == 'min' && tempX >= maxL) {
              x = maxL;
            }

            if(scope.type == 'max' && tempX >= minL) {
              x = tempX;
            } else if(scope.type == 'max' && tempX <= minL) {
              x = minL;
            }

          } else {

            if(calcX(tempX) < 0) {
              x = 0;
            } else if(calcX(tempX) > 100) {
              console.log('hit!');
              x = unCalcX(100);
            }

          }

          element.css({
            left: calcX(x) + '%'
          });

        }

        function mouseup() {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
        }

        function windowResize(event) {
          x = unCalcX(element.css('left').replace('%',''));
          element.triggerHandler('mousedown');
          element.triggerHandler('mousemove');
          element.triggerHandler('mouseup');
        }

        window.onresize = windowResize;

      }
    };
  })
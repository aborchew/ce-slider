'use strict';

angular.module('ceSlider')

  .directive('ceSlider', function () {
    return {
      templateUrl: 'partials/ceSlider.html',
      restrict: 'E',
      scope: {
        'model': '=ceModel',
        'modelMax': '=ceModelMax',
        'data': '=ceData',
        'type': '@ceSliderType',
        'ticks': '@ceTicks'
      },
      link: function postLink(scope, element, attr) {

        var tickCount = 0
          , ticks = false
          ;

        if(scope.ticks && parseInt(scope.ticks)) {
          ticks = true;
          tickCount = parseInt(scope.ticks);
        } else if(!!scope.ticks && scope.data && scope.data.length) {
          ticks = true;
          tickCount = scope.data.length
        }

        if(ticks) {
          for(var i = 0 ; i < tickCount; i++) {
            element.find('span').append('<div class="tick" style="left:' + 100/tickCount*i + '%;"></div>');
          }
        }

        var handles = function () {
          var hndls = [];
          var els = element.children().children();
          for(var i = 0, len = els.length; i < len; i++) {
            if(angular.element(els[i]).attr('drag-handle')) {
              hndls[hndls.length] = angular.element(els[i]);
            }
          }
          return hndls;
        }();

        scope.container = angular.element(element.children()[0]);
        scope.handle = handles[0];
        scope.minPossible = Math.min.apply(null, scope.data);

        if(scope.type != 'range') {
          scope.handleMax.remove();
        } else {
          scope.handleMax = handles[1];
          scope.maxPossible = Math.max.apply(null, scope.data);
        }

        var windowTimer;

        function windowResize() {
          clearTimeout(windowTimer);
          windowTimer = setTimeout(function () {
            for(var i = 0, len = handles.length; i < len; i++) {
              handles[i].triggerHandler('updatePosition');
            }
          },250);
        }

        window.onresize = windowResize;

      }
    };
  })
  
  .directive('dragHandle', function ($document, $timeout) {
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
          scope.model = 'modelMax';
        } else {
          scope.model = 'model';
        }

        function updatePosition () {
          x = unCalcX(element.css('left').replace('%',''));
          $document.triggerHandler('mousedown');
          $document.triggerHandler('mousemove');
          $document.triggerHandler('mouseup');
        }

        element.on('updatePosition', updatePosition);
        element.on('mousedown', eventStart);
        element.on('touchstart', eventStart);

        function eventStart (event) {
          // for(var i in event) {
          //   console.log(i + ': ' + event[i]);
          // }
          event.preventDefault();
          startX = (event.screenX || event.pageX || event.touches[0].pageX) - x;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
          $document.on('touchmove', mousemove);
          $document.on('touchend', mouseup);
        };

        function calcX(x) {
          // fakelog(x + '|' + scope.$parent.container[0].clientWidth);
          return x / scope.$parent.container[0].clientWidth * 100;
        }

        function unCalcX(x) {
          return x * scope.$parent.container[0].clientWidth / 100;
        }

        function mousemove(event) {

          var tempX = (event.screenX || event.pageX || event.touches[0].pageX) - startX;

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
              x = unCalcX(100);
            }

          }

          element.css({
            left: calcX(x) + '%'
          });

          $timeout(function () {
            scope.$parent[scope.model] = scope.$parent.data[Math.floor(scope.$parent.data.length * calcX(x) / 100.01)];
            scope.value = scope.$parent[scope.model];
          },0);

        }

        function mouseup(event) {
          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
          $document.off('touchmove', mousemove);
          $document.off('touchend', mouseup);
        }

      }
    };
  })
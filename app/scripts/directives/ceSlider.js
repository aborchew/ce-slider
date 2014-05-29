'use strict';

angular.module('ceSlider')

  .directive('ceSlider', function ($document, $timeout) {
    return {
      templateUrl: 'partials/ceSlider.html',
      restrict: 'E',
      scope: {
        'model': '=ceModel',
        'modelMax': '=ceModelMax',
        'data': '=ceData',
        'snap': '=ceSnap',
        'ticks': '@ceTicks',
        'touchingClass': '@ceTouchingClass',
        'draggingClass': '@ceDraggingClass',
        'dragAreaClass': '@ceDragAreaClass',
        'labelClass': '@ceLabelClass',
        'labelMaxClass': '@ceLabelMaxClass',
        'dragHandleClass': '@ceDragHandleClass',
        'dragHandleMaxClass': '@ceDragHandleMaxClass',
        'tickContainerClass': '@ceTickContainerClass',
        'tickClass': '@ceTickClass',
        'touchingClassOutDelay': '@ceTouchingClassOutDelay',
        'draggingClassOutDelay': '@ceDraggingClassOutDelay',
        'dragHandleContent': '@ceDragHandleContent',
        'dragHandleMaxContent': '@ceDragHandleMaxContent',
        'dragHandleOverlapClass': '@ceDragHandleOverlapClass',
        'dragHandleOverlapMaxClass': '@ceDragHandleOverlapMaxClass'
      },
      link: function postLink(scope, element, attr) {

        if(!scope.data) {
          throw new Error('Do you even data, bro?');
        }

        scope.touchingClass = scope.touchingClass || 'touching';
        scope.draggingClass = scope.draggingClass || 'dragging';
        scope.dragAreaClass = scope.dragAreaClass || 'drag-area';
        scope.labelClass = scope.labelClass || 'value-label';
        scope.labelMaxClass = scope.labelMaxClass || 'value-label-max';
        scope.dragHandleClass = scope.dragHandleClass || 'drag-handle';
        scope.dragHandleMaxClass = scope.dragHandleMaxClass || 'drag-handle-max';
        scope.tickContainerClass = scope.tickContainerClass || 'tick-container';
        scope.tickClass = scope.tickClass || 'tick';
        scope.touchingClassOutDelay = parseInt(scope.touchingClassOutDelay) || 0;
        scope.draggingClassOutDelay = parseInt(scope.draggingClassOutDelay) || 0;
        scope.tickCount = 0;

        var ticks = false
          , windowTimer
          ;

        if(parseInt(scope.ticks)) {
          scope.tickCount = parseInt(scope.ticks);
        } else if(scope.data.length) {
          scope.tickCount = scope.data.length
        }

        if(scope.ticks) {
          ticks = true;
        }

        if(ticks) {
          for(var i = 0 ; i < scope.tickCount; i++) {
            element.find('span').append('<div class="' + scope.tickClass + '" style="left:' + 100/scope.tickCount*i + '%;"></div>');
          }
        } else {
          $timeout(function () {
            element.children().find('span').remove();
          }, 100);
        }

        var handles = function () {
          var hndls = [];
          var els = element.children().children();
          for(var i = 0, len = els.length; i < len; i++) {
            if(angular.element(els[i]).attr(scope.dragHandleClass)) {
              hndls[hndls.length] = angular.element(els[i]);
            }
          }
          return hndls;
        }();

        scope.container = angular.element(element.children()[0]);
        scope.handle = handles[0];
        scope.minPossible = Math.min.apply(null, scope.data);
        scope.$parent[scope.model] = scope.minPossible;
        scope.handleMax = handles[1];
        scope.maxPossible = Math.max.apply(null, scope.data);
        scope.$parent[scope.modelMax] = scope.maxPossible;

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
        'type': '@dragHandle',
        'snap': '=ceSnap',
        'touchingClass': '=ceTouchingClass',
        'draggingClass': '=ceDraggingClass',
        'touchingClassOutDelay': '=ceTouchingClassOutDelay',
        'draggingClassOutDelay': '=ceDraggingClassOutDelay',
        'dragHandleOverlapClass': '=ceDragHandleOverlapClass',
        'dragHandleOverlapMaxClass': '=ceDragHandleOverlapMaxClass'
      },
      link: function postLink(scope, element, attr) {

        var startX = 0
          , x = 0
          , handle
          , handleMax
          , touchingClassOutTimer
          , draggingClassOutTimer
          , ticks = []
          ;

        if(scope.type == 'max') {
          element.css({
            left: '100%'
          });
          $timeout(function() {
            x = element[0].offsetLeft - parseInt(getStyle('margin-left'));
            startX = x;
          }, 0);
          scope.model = 'modelMax';
        } else {
          scope.model = 'model';
        }

        $timeout(function () {
          scope.$parent[scope.model] = scope.$parent.data[Math.floor(scope.$parent.data.length * calcX(x) / 100.01)];
          scope.value = scope.$parent[scope.model];
          handle = scope.$parent.handle
          handleMax = scope.$parent.handleMax
        },0);

        // http://www.quirksmode.org/dom/getstyles.html
        function getStyle(styleProp) {
          var x = element[0];
          if (x.currentStyle) {
            var y = x.currentStyle[styleProp];
          } else if (window.getComputedStyle) {
            var y = document.defaultView.getComputedStyle(x,null).getPropertyValue(styleProp);
          }
          return y;
        }

        function isAndroid (event) {
          if(event.touches && event.touches[0] && event.touches[0].pageX) {
            return event.touches[0].pageX;
          }
          return 0;
        }

        if(!!scope.$parent.ticks) {
          $timeout(function () {
            ticks = element.parent().children().children();
          }, 100);
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
          event.preventDefault();
          element.addClass(scope.touchingClass);
          startX = (event.screenX || event.pageX || isAndroid(event)) - x;
          $document.on('mousemove', mousemove);
          $document.on('mouseup', mouseup);
          $document.on('touchmove', mousemove);
          $document.on('touchend', mouseup);
        };

        // Convert pixel offset to percentage
        function calcX(x) {
          return x / scope.$parent.container[0].clientWidth * 100;
        }

        // Convert percentage to pixel offset
        function unCalcX(x) {
          return x * scope.$parent.container[0].clientWidth / 100;
        }

        function mousemove(event) {

          element.addClass(scope.draggingClass);
          clearTimeout(draggingClassOutTimer);
          draggingClassOutTimer = setTimeout(function () {
            element.removeClass(scope.draggingClass);
          }, scope.draggingClassOutDelay);

          var tempX = (event.screenX || event.pageX || isAndroid(event)) - startX
            , cX = calcX(tempX)
            , minL = unCalcX(handle.css('left').replace('%',''))
            , maxL = unCalcX(handleMax.css('left').replace('%',''))
            ;

          if(cX >= 0 && cX <= 100) {

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

            if(cX < 0 && scope.type == 'min') {
              x = 0;
            } else if(cX > 100 && scope.type == 'max') {
              x = unCalcX(100);
            }

          }

          if(!!scope.snap) {
            var tickIndex = Math.round(scope.$parent.tickCount * calcX(x) / 100.01);
            x = unCalcX(tickIndex/scope.$parent.tickCount*100);
          }

          element.css({
            left: calcX(x) + '%'
          });

          $timeout(function () {
            scope.$parent[scope.model] = scope.$parent.data[Math.floor(scope.$parent.data.length * calcX(x) / 100.01)];
            scope.value = scope.$parent[scope.model];
          },0);

          if(handle[0].offsetWidth + handle[0].offsetLeft >= handleMax[0].offsetLeft) {
            handle.addClass(scope.dragHandleOverlapClass);
            handleMax.addClass(scope.dragHandleOverlapClass);
            handleMax.addClass(scope.dragHandleOverlapMaxClass);
          } else {
            handle.removeClass(scope.dragHandleOverlapClass);
            handleMax.removeClass(scope.dragHandleOverlapClass);
            handleMax.removeClass(scope.dragHandleOverlapMaxClass);
          }

        }

        function mouseup(event) {

          clearTimeout(touchingClassOutTimer);
          touchingClassOutTimer = setTimeout(function () {
            element.removeClass(scope.touchingClass);
          }, scope.touchingClassOutDelay);

          clearTimeout(draggingClassOutTimer);
          draggingClassOutTimer = setTimeout(function () {
            element.removeClass(scope.draggingClass);
          }, scope.draggingClassOutDelay);

          $document.off('mousemove', mousemove);
          $document.off('mouseup', mouseup);
          $document.off('touchmove', mousemove);
          $document.off('touchend', mouseup);
        }

      }
    };
  })
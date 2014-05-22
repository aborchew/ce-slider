angular.module('d3App').
  directive('draggable', function($document) {
    return function(scope, element, attr) {

      var startX = 0
        , x = 0
        ;

      scope.type = attr.draggable;

      if(scope.type === 'max') {
        element.css({
          right: '0px',
          left: 'auto'
        });
        x = element[0].offsetLeft;
      }     

      element.on('mousedown', function(event) {
        // Prevent default dragging of selected content
        event.preventDefault();
        startX = event.screenX - x;
        $document.on('mousemove', mousemove);
        $document.on('mouseup', mouseup);
      });

      function mousemove(event) {
        var tempX = event.screenX - startX;
        if(tempX >= 0 && tempX + element[0].clientWidth <= element.parent('.drag-area')[0].clientWidth) {
          x = tempX;
        } else {
          if(tempX < 0) {
            x = 0;
          } else if(tempX + element[0].clientWidth > element.parent('.drag-area')[0].clientWidth) {
            x = element.parent('.drag-area')[0].clientWidth - element[0].clientWidth;
          }
        }
        element.css({
          left:  x + 'px',
          right: 'auto'
        });
      }

      function mouseup() {
        $document.off('mousemove', mousemove);
        $document.off('mouseup', mouseup);
      }
    };
  });
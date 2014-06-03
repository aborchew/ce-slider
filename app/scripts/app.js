'use strict';

angular
  .module('ceSliderApp', [
    'ngSanitize'
  ])
  .run(function ($rootScope) {

    $rootScope.getAttr = function(object, string, splitter) {

      if (!string) return object;

      var splitter = splitter || '.';

      return string.split(splitter).reduce(function (pV, cV) {
        return pV[cV];
      }, object);

    }

    if(!Array.isArray) {
      Array.isArray = function(arg) {
        return Object.prototype.toString.call(arg) === '[object Array]';
      };
    }
    
  })

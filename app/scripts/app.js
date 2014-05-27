'use strict';

angular
  .module('ceSlider', []);

function fakelog(str) {
  console.log(str);
  angular.element(document.getElementById('console')).html(str);
}
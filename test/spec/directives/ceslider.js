'use strict';

describe('Directive: ceSlider', function () {

  // load the directive's module
  beforeEach(module('ceSliderApp'));

  var element
    , rootScope
    , scope
    , isolateScope
    // , initData = [0,1,2,3,4,5,6,7,8,9,4,7,2,3,5,4,5,6,7,8,3,4]
    , initData = [
        {
          'val': 0 
        },
        {
          'val': 9 
        },
        {
          'val': 7 
        },
        {
          'val': 7 
        },
        {
          'val': 2 
        }
      ]
    ;

  beforeEach(inject(function ($rootScope, $compile) {
    rootScope = $rootScope.$new();
    rootScope.initData = initData;
    element = angular.element(
      '<ce-slider ' +
        'ce-data="initData" ' +
        'ce-value="lowValue" ' +
        'ce-node="val" ' +
        'ce-step="1" ' +
      '></ce-slider>'
    );
    element = $compile(element)(rootScope);
    scope = element.scope();
    isolateScope = element.isolateScope();
  }));

  describe('Should have a valid data model defined: ', function () {

    it('should be an Array', inject(function () {
      expect(isolateScope.data).toBeArray()
    }));

    it('should have at least two indexes', inject(function () {
      expect(isolateScope.data.length).toBeGreaterThan(1)
    }));

    it('should have a minimum and maximum which are not equal', inject(function () {
      expect(isolateScope.min).toBeNumber();
      expect(isolateScope.max).toBeNumber();
      expect(isolateScope.min).toBeLessThan(isolateScope.max);
    }));

    it('should throw an error otherwise.', inject(function ($compile) {

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="[0,0,0]" ce-value="foo" ce-step=".1"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
      }).toThrowError();

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="" ce-value="foo" ce-step=".1"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
      }).toThrowError();

    }));

  });

  describe('Should have a value model defined', function () {

    it('the attribute should be set', inject(function () {
      expect(angular.element(element).attr('ce-value')).toBeDefined()
    }));

    it('should throw an error otherwise', inject(function ($compile) {
      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="[0,1]" ce-value="" ce-step=".1"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
      }).toThrowError();
    }));

  });

  describe('Should have a valid step provided, or 1 should be valid ', function () {

    it('should throw an error otherwise', inject(function ($compile) {

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="[0,1]" ce-value="foo" ce-step="3"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
      }).toThrowError();

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="[0,.2,.5,.9]" ce-value="foo"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
      }).toThrowError();

    }));

  });

});

'use strict';

describe('Directive: ceSlider', function () {

  // load the directive's module
  beforeEach(module('ceSliderApp', 'templates'));

  var element
    , rootScope
    , scope
    , isolateScope
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

  beforeEach(inject(function ($templateCache, $rootScope, $compile) {
    $templateCache.put('partials/template.html', $templateCache.get('app/partials/template.html'));
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
    rootScope.$digest();
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
        scope.$digest();
      }).toThrowError();

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="" ce-value="foo" ce-step=".1"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
        scope.$digest();
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
        scope.$digest();
      }).toThrowError();
    }));

  });

  describe('If a step is provided, it should be valid', function () {

    it('should throw an error otherwise', inject(function ($compile) {

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="[0,1]" ce-value="foo" ce-step="3"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
        scope.$digest();
      }).toThrowError();

    }));

  });

  describe('The step values should be calculated', function () {

    it('based on user input', inject(function ($compile) {

      expect(isolateScope.steps).toEqual([0,1,2,3,4,5,6,7,8,9]);

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="[0,2]" ce-value="foo" ce-step=".2"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
        scope.$digest();
        return tmpElement.isolateScope().steps
      }()).toEqual([0,0.2,0.4,0.6,0.8,1,1.2,1.4,1.6,1.8,2]);

      expect(function () {
        var tmpElement = angular.element('<ce-slider ce-data="[0,.02]" ce-value="foo" ce-step=".002"></ce-slider>');
        tmpElement = $compile(tmpElement)(rootScope);
        scope.$digest();
        return tmpElement.isolateScope().steps
      }()).toEqual([0,0.002,0.004,0.006,0.008,0.010,0.012,0.014,0.016,0.018,0.02]);

    }));

  });

});

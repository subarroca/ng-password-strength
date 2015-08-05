(function() {
  'use strict';

  /* global _ */

  /**
   * @ngdoc directive
   * @name ngPasswordStrengthApp.directive:ngPasswordStrength
   * @description
   * Progress bar showing the strength of a given password
   */
  angular
    .module('ngPasswordStrength')
    .directive('ngPasswordStrength', ngPasswordStrength);

    function ngPasswordStrength(PasswordStrengthService) {
      return {
        template: '<div class="progress {{valueClass.outter}}"><div class="{{valueClass.inner}} {{innerClass}}" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100" ng-style="{width : ( value + \'%\' ) }"><span class="sr-only">{{value}}%</span></div></div>',
        restrict: 'A',
        scope: {
          pwd: '=ngPasswordStrength',
          value: '=strength',
          innerClassPrefix: '@?',
          outterClassPrefix: '@?',
          innerClass: '@?',
          mode: '@?' //Mode is set via attribute
        },
        link: link
      };

      function link(scope /*, elem, attrs*/ ) {

        scope.value = scope.value || PasswordStrengthService.measureStrength(scope.pwd);
        scope.innerClassPrefix = scope.innerClassPrefix || '';
        scope.outterClassPrefix = scope.outterClassPrefix || '';

        var modes = {
          foundation: {
            innerClass: 'meter'
          },
          bootstrap: {
            innerClass: 'progress-bar',
            innerClassPrefix: 'progress-bar-'
          }
        };

        scope.$watch('mode', function() {

          if (scope.mode === 'bootstrap' || scope.mode === 'foundation') {
            //If bootstrap or foundation mode then apply the classes
            angular.extend(scope, modes[scope.mode]);
            return;
          }

          scope.valueClass = getClass(scope.value);
        });

        scope.$watch('pwd', function() {
          scope.value = PasswordStrengthService.measureStrength(scope.pwd);
          scope.valueClass = getClass(scope.value);
        });

        function getClass(s) {
          switch (Math.round(s / 33)) {
            case 0:
            case 1:
              return {
                outter: scope.outterClassPrefix + 'danger',
                inner: scope.innerClassPrefix + 'danger'
              };
            case 2:
              return {
                outter: scope.outterClassPrefix + 'warning',
                inner: scope.innerClassPrefix + 'warning'
              };
            case 3:
              return {
                outter: scope.outterClassPrefix + 'success',
                inner: scope.innerClassPrefix + 'success'
              };
          }
        }
      }
    }

})();

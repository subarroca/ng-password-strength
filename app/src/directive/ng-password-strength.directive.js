(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name ngPasswordStrengthApp.directive:ngPasswordStrength
     * @description
     * Progress bar showing the strength of a given password
     */
    angular
        .module('ngPasswordStrength')
        .directive('ngPasswordStrength', ngPasswordStrength);

    function ngPasswordStrength(PasswordStrengthFormulaService, PasswordStrengthEntropyService) {
        return {
            templateUrl: 'src/directive/ng-password-strength.tpl.html',
            restrict: 'A',
            scope: {
                password: '=ngPasswordStrength',
                value: '=strength',
                innerClassPrefix: '@?',
                outterClassPrefix: '@?',
                innerClass: '@?',
                cssMode: '@?', // CSS Mode. Can be 'bootstrap' or 'foundation'
                calculationMode: '@?', // Strength calculation mode. Can be 'formula' or 'entropy'. Default: 'formula' to ensure backwards compatibility
                goal: '@?' // Goal to achieve in entropy calculation. Default: 96
            },
            link: link
        };

        function link(scope /*, elem, attrs*/ ) {

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

            scope.$watch('cssMode', function(newVal /*, oldVal*/ ) {
                if (newVal === 'bootstrap' || newVal === 'foundation') {
                    //If bootstrap or foundation mode then apply the classes
                    angular.extend(scope, modes[scope.cssMode]);
                    return;
                }

                scope.valueClass = getClass(scope.value);
            });

            scope.$watch('password', function() {
                calculateStrength();
            });

            scope.$watch('calculationMode', function() {
                calculateStrength();
            });


            // calculate strength based on password and calculation mode
            function calculateStrength() {
                if (scope.password && scope.password.length) {
                    if (scope.calculationMode === 'entropy') {
                        // ENTROPY

                        var goal = parseInt( scope.goal || '96');
                        scope.value = PasswordStrengthEntropyService.getStrength(scope.password, goal);

                    } else {
                        // FORMULA (default)
                        scope.value = PasswordStrengthFormulaService.getStrength(scope.password);
                    }
                    scope.valueClass = getClass(scope.value);

                } else {
                    scope.value = 0;
                    scope.class = getClass(0);
                }
            }


            // getClasses depending on percentage
            function getClass(percentage) {
                switch (Math.round(percentage / 33)) {
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
                    default:
                    // 100 or more
                        return {
                            outter: scope.outterClassPrefix + 'success',
                            inner: scope.innerClassPrefix + 'success'
                        };
                }
            }
        }
    }

})();

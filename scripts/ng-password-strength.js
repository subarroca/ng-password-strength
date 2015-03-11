(function() {
  'use strict';

  /* global _ */

  /**
   * @ngdoc directive
   * @name ngPasswordStrengthApp.directive:ngPasswordStrength
   * @description
   * Progress bar showing the strength of a given password
   */
  angular.module('ngPasswordStrength', [])
    .directive('ngPasswordStrength',
      function() {
        return {
          template: '<div class="progress {{valueClass.outter}}"><div class="{{valueClass.inner}} {{innerClass}}" role="progressbar" aria-valuenow="{{value}}" aria-valuemin="0" aria-valuemax="100" ng-style="{width : ( value + \'%\' ) }"><span class="sr-only">{{value}}%</span></div></div>',
          restrict: 'A',
          scope: {
            pwd: '=ngPasswordStrength',
            value: '=strength',
            innerClassPrefix: '@?',
            outterClassPrefix: '@?',
            innerClass: '@?',
            mode: '=?'
          },
          link: function(scope /*, elem, attrs*/ ) {
            var modes = {
                foundation: {
                  innerClass: 'meter'
                },
                bootstrap: {
                  innerClass: 'progress-bar',
                  innerClassPrefix: 'progress-bar-'
                }
              },
              measureStrength = function(p) {
                var stringReverse = function(str) {
                    for (var i = str.length - 1, out = ''; i >= 0; out += str[i--]) {}
                    return out;
                  },
                  matches = {
                    pos: {},
                    neg: {}
                  },
                  counts = {
                    pos: {},
                    neg: {
                      seqLetter: 0,
                      seqNumber: 0,
                      seqSymbol: 0
                    }
                  },
                  tmp,
                  strength = 0,
                  letters = 'abcdefghijklmnopqrstuvwxyz',
                  numbers = '01234567890',
                  symbols = '\\!@#$%&/()=?¿',
                  back,
                  forth,
                  i;

                if (p) {
                  // Benefits
                  matches.pos.lower = p.match(/[a-z]/g);
                  matches.pos.upper = p.match(/[A-Z]/g);
                  matches.pos.numbers = p.match(/\d/g);
                  matches.pos.symbols = p.match(/[$-/:-?{-~!^_`\[\]]/g);
                  matches.pos.middleNumber = p.slice(1, -1).match(/\d/g);
                  matches.pos.middleSymbol = p.slice(1, -1).match(/[$-/:-?{-~!^_`\[\]]/g);

                  counts.pos.lower = matches.pos.lower ? matches.pos.lower.length : 0;
                  counts.pos.upper = matches.pos.upper ? matches.pos.upper.length : 0;
                  counts.pos.numbers = matches.pos.numbers ? matches.pos.numbers.length : 0;
                  counts.pos.symbols = matches.pos.symbols ? matches.pos.symbols.length : 0;

                  tmp = _.reduce(counts.pos, function(memo, val) {
                    // if has count will add 1
                    return memo + Math.min(1, val);
                  }, 0);

                  counts.pos.numChars = p.length;
                  tmp += (counts.pos.numChars >= 8) ? 1 : 0;

                  counts.pos.requirements = (tmp >= 3) ? tmp : 0;
                  counts.pos.middleNumber = matches.pos.middleNumber ? matches.pos.middleNumber.length : 0;
                  counts.pos.middleSymbol = matches.pos.middleSymbol ? matches.pos.middleSymbol.length : 0;

                  // Deductions
                  matches.neg.consecLower = p.match(/(?=([a-z]{2}))/g);
                  matches.neg.consecUpper = p.match(/(?=([A-Z]{2}))/g);
                  matches.neg.consecNumbers = p.match(/(?=(\d{2}))/g);
                  matches.neg.onlyNumbers = p.match(/^[0-9]*$/g);
                  matches.neg.onlyLetters = p.match(/^([a-z]|[A-Z])*$/g);

                  counts.neg.consecLower = matches.neg.consecLower ? matches.neg.consecLower.length : 0;
                  counts.neg.consecUpper = matches.neg.consecUpper ? matches.neg.consecUpper.length : 0;
                  counts.neg.consecNumbers = matches.neg.consecNumbers ? matches.neg.consecNumbers.length : 0;


                  // sequential letters (back and forth)
                  for (i = 0; i < letters.length - 2; i++) {
                    var p2 = p.toLowerCase();
                    forth = letters.substring(i, parseInt(i + 3));
                    back = stringReverse(forth);
                    if (p2.indexOf(forth) !== -1 || p2.indexOf(back) !== -1) {
                      counts.neg.seqLetter++;
                    }
                  }

                  // sequential numbers (back and forth)
                  for (i = 0; i < numbers.length - 2; i++) {
                    forth = numbers.substring(i, parseInt(i + 3));
                    back = stringReverse(forth);
                    if (p.indexOf(forth) !== -1 || p.toLowerCase().indexOf(back) !== -1) {
                      counts.neg.seqNumber++;
                    }
                  }

                  // sequential symbols (back and forth)
                  for (i = 0; i < symbols.length - 2; i++) {
                    forth = symbols.substring(i, parseInt(i + 3));
                    back = stringReverse(forth);
                    if (p.indexOf(forth) !== -1 || p.toLowerCase().indexOf(back) !== -1) {
                      counts.neg.seqSymbol++;
                    }
                  }

                  // repeated chars
                  counts.neg.repeated = _.chain(p.toLowerCase().split('')).
                  countBy(function(val) {
                      return val;
                    })
                    .reject(function(val) {
                      return val === 1;
                    })
                    .reduce(function(memo, val) {
                      return memo + val;
                    }, 0)
                    .value();

                  // Calculations
                  strength += counts.pos.numChars * 4;
                  if (counts.pos.upper) {
                    strength += (counts.pos.numChars - counts.pos.upper) * 2;
                  }
                  if (counts.pos.lower) {
                    strength += (counts.pos.numChars - counts.pos.lower) * 2;
                  }
                  if (counts.pos.upper || counts.pos.lower) {
                    strength += counts.pos.numbers * 4;
                  }
                  strength += counts.pos.symbols * 6;
                  strength += (counts.pos.middleSymbol + counts.pos.middleNumber) * 2;
                  strength += counts.pos.requirements * 2;

                  strength -= counts.neg.consecLower * 2;
                  strength -= counts.neg.consecUpper * 2;
                  strength -= counts.neg.consecNumbers * 2;
                  strength -= counts.neg.seqNumber * 3;
                  strength -= counts.neg.seqLetter * 3;
                  strength -= counts.neg.seqSymbol * 3;

                  if (matches.neg.onlyNumbers) {
                    strength -= counts.pos.numChars;
                  }
                  if (matches.neg.onlyLetters) {
                    strength -= counts.pos.numChars;
                  }
                  if (counts.neg.repeated) {
                    strength -= (counts.neg.repeated / counts.pos.numChars) * 10;
                  }
                }

                return Math.max(0, Math.min(100, Math.round(strength)));
              },


              getClass = function(s) {
                switch (Math.round(s / 33)) {
                  case 0:
                  case 1:
                    return {
                      inner: scope.outterClassPrefix + 'danger',
                      outter: scope.innerClassPrefix + 'alert'
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
              };



            // DISPLAY


            scope.innerClassPrefix = scope.innerClassPrefix || '';
            scope.outterClassPrefix = scope.outterClassPrefix || '';


            scope.$watch('mode', function() {
              angular.extend(scope, modes[scope.mode]);
              scope.valueClass = getClass(scope.value);
            });

            scope.$watch('pwd', function() {
              scope.value = measureStrength(scope.pwd);
              scope.valueClass = getClass(scope.value);
            });
          },
        };
      });
})();

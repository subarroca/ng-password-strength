(function() {
  'use strict';

  /* global _ */

  /**
   * @ngdoc directive
   * @name ngPasswordStrengthApp.factory:PasswordStrengthService
   * @description
   * Service to determine strength of password
   */
  angular
    .module('ngPasswordStrength')
    .factory('PasswordStrengthService', PasswordStrengthService);

    function PasswordStrengthService() {
      return {
        measureStrength: measureStrength
      };

      function measureStrength(p) {
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

          tmp = Object.keys(counts.pos).reduce(function (previous, key) {
            return previous + Math.min(1, counts.pos[key]);
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


          var repeats = {};
          var _p = p.toLowerCase();
          var arr = _p.split('');
          counts.neg.repeated = 0;
          for(i = 0; i< arr.length; i++) {
            var _reg = new RegExp(_p[i],'g');
            var cnt = _p.match(_reg).length;
            if (cnt > 1 && !repeats[_p[i]]) {
              repeats[_p[i]] = cnt;
              counts.neg.repeated += cnt;
            }
          }

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
      }
    }

})();

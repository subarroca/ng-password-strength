(function() {
    'use strict';

    /**
     * @ngdoc directive
     * @name ngPasswordStrengthApp.factory:PasswordStrengthEntropyService
     * @description
     * Service to determine strength of password
     */
    angular
        .module('ngPasswordStrength')
        .factory('PasswordStrengthEntropyService', PasswordStrengthEntropyService);

    function PasswordStrengthEntropyService() {
        var service = {
            getStrength: getStrength
        };




        /////////////////////////////




        function add(label, exp, score) {
            sets.push({
                label: label,
                regex: exp,
                score: score
            });
        }

        var sets = [];

        add('ASCII Lowercase', /[a-z]/, 26);
        add('ASCII Uppercase', /[A-Z]/, 26);
        add('ASCII Numbers', /\d/, 10);
        add('ASCII Top Row Symbols', /[!@£#\$%\^&\*\(\)\-_=\+]/, 15);
        add('ASCII Other Symbols', /[\?\/\.>\,<`~\\|"';:\]\}\[\{\s]/, 19);

        // Unicode Latin Subset
        add('Unicode Latin 1 Supplement', /[\u00A1-\u00FF]/, 94);
        add('Unicode Latin Extended A', /[\u0100-\u017F]/, 128);
        add('Unicode Latin Extended B', /[\u0180-\u024F]/, 208);
        add('Unicode Latin Extended C', /[\u2C60-\u2C7F]/, 32);
        add('Unicode Latin Extended D', /[\uA720-\uA7FF]/, 29);

        // Unicode Cyrillic Subset
        add('Unicode Cyrillic Uppercase', /[\u0410-\u042F]/, 32);
        add('Unicode Cyrillic Lowercase', /[\u0430-\u044F]/, 32);



        function getStrength(password, goal) {
            var characters = 0;

            for (var i = 0; i < sets.length; i++) {
                var match = password.match(sets[i].regex);
                if (match) {
                    characters += sets[i].score;
                }
            }

            var entropy = (Math.log(characters) / Math.LN2) * password.length;

            return Math.min(100, Math.round(100 * entropy / goal));
        }




        /////////////////////////////


        return service;
    }
})();

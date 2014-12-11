# ng-password-strength

Password strength checker wrapped in an angular directive
Based on:

*	[http://blog.brunoscopelliti.com/angularjs-directive-to-test-the-strength-of-a-password][bruno]
*	[http://www.passwordmeter.com][meter]

  [bruno]: http://blog.brunoscopelliti.com/angularjs-directive-to-test-the-strength-of-a-password
  [meter]: http://www.passwordmeter.com


## Usage

1. Bower should add `ng-password-strength.min.js` to you main file (index.html)

  you can download this by:
  * using bower and running `bower install ng-password-strength`
  * downloading the [production version][min] or the [development version][max].

  [min]: https://raw.github.com/subarroca/ng-password-strength/master/dist/ng-password-strength.min.js
  [max]: https://raw.github.com/subarroca/ng-password-strength/master/dist/ng-password-strength.js

  In your web page:

  ```html
  <script src="ng-password-strength/dist/scripts/ng-password-strength.js"></script>
  ```

2. Bower should add `bootstrap`, `angular-bootstrap`, `underscore` and `underscore.string` to your main file (index.html). Some of them are not automatically added so you'd better check them.

  ```html
  <link rel="stylesheet" href="bootstrap/dist/css/bootstrap.css" />
  
  <script src="angular/angular.js"></script>
  <script src="underscore/underscore.js"></script>
  <script src="underscore.string/lib/underscore.string.js"></script>
  ```

3. Set `ng-password-strength` as a dependency in your module
  ```javascript
  var myapp = angular.module('myapp', ['ngPasswordStrength'])
  ```

4. Add ng-password-strength directive to the wanted element, example:
  ```html
  <div ng-password-strength="pass" strength="passwordStrength"> .... </div>
  ```

  You can get the value [0-100] through the param 'strength'

## Formula
Values limited to [0-100]

* Pros:

  * Number of Characters `+ n*4`
  * Uppercase Letters (if any uppercase)  `+ (len-n)*2`
  * Lowercase Letters (if any lowercase)  `+ (len-n)*2`
  * Numbers (if any letter)  `+ n*4`
  * Symbols  `+ n*6`
  * Middle Numbers or Symbols  `+ n*2`
  * Requirements `+ n*2`

* Cons:

  * Letters Only `- n`
  * Numbers Only `- n`
  * Repeat Characters (Case Insensitive) `- (n/len) *10`
  * Consecutive Uppercase Letters  `- n*2`
  * Consecutive Lowercase Letters  `- n*2`
  * Consecutive Numbers  `- n*2`
  * Sequential Letters (3+)  `- n*3`
  * Sequential Numbers (3+)  `- n*3`
  * Sequential Symbols (3+)  `- n*3`

## Examples
See `app/index.html` in the respository.

## TODO
Create tests

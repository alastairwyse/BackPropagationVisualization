/**
 * @name trimDouble
 * @desc Trims decimal values to a fixed number of characters
 *
 * @param {number} inputDouble - The decimal value to trim
 * @return {string} The value trimmed to a fixed number of characters
 */
app.filter('trimDoubleFilter', function () {
    return function (inputDouble) {
            var doubleDisplayDigits = 7;

            // TODO: Need to find a way to NOT have this if statement
            //   Angular seems to apply the filter twice... once before the $http.get has returned, and once after
            //   Without this statement, the first time causes and error
            if (angular.isUndefined(inputDouble) == true) {
                return "";
            }
            else {
                return inputDouble.toFixed(doubleDisplayDigits).substring(0, doubleDisplayDigits);
            }
        }
    }
);

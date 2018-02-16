/**
 * @name utilitiesService
 * @desc Javascript utilities for the application.
 */
app.service("utilitiesService", function () {

        // Define values for the weights that should be represented by extremes of colour (i.e. black and white)
        var weightBlackShadeValue = 5;
        var weightCentreShadeValue = 0.0;
        var weightWhiteShadeValue = -5.0;
        var negativeWeightFontColour = "#ffb545";

        /**
         * @name convertDoubleToGreyShadeColour
         * @desc Converts the inputted numeric value into an html hex color, scaled between upper and lower values defined in weightBlackShadeValue and weightWhiteShadeValue
         *
         * @param {number} inputDouble - The number to convert
         * @return {string} A string containing an html hex colour (prefixed with '#')
         */
        this.convertDoubleToGreyShadeColour = function (inputDouble) {
            if (inputDouble > weightBlackShadeValue) {
                return "#FFFFFF";
            }
            if (inputDouble < weightWhiteShadeValue) {
                return "#000000";
            }

            // Find a number between 0 and 1 representing the grey shade
            var scaleRange = Math.abs(weightWhiteShadeValue) + Math.abs(weightBlackShadeValue);
            var scaleValue = inputDouble - weightWhiteShadeValue;
            var decimalValue = scaleValue / scaleRange;
            //decimalValue = 1 - decimalValue;
            // Convert to hex
            var eightBitShade = Math.round(decimalValue * 255);
            var hexShade = eightBitShade.toString(16);
            if (hexShade.length == 1) {
                hexShade = "0" + hexShade;
            }

            return "#" + hexShade + hexShade + hexShade;
        }

        /**
         * @name getFontColourForWeightValue
         * @desc Gets the appropriate font colour corresponding to the inputted weight value
         *
         * @param {number} inputWeight - The weight
         * @return {string} A string containing an html hex colour (prefixed with '#')
         */
        this.getFontColourForWeightValue = function (inputWeight) {
            if (inputWeight > weightCentreShadeValue) {
                return "#000000";
            }
            else {
                return negativeWeightFontColour;
            }
        }

        /**
         * @name convertErrorValuesToHtml
         * @desc Converts a set of key/value pairs representing details of an error to an HTML-formatted error message.
         *
         * @param {Object} errorDetails - A set of name/value pairs representing details of an error
         * @return {string} The error details represented as HTML
         */
        this.convertErrorValuesToHtml = function (errorDetails) {
            var errorHtml = "";
            for (var i = 0; i < errorDetails.length; i++) {
                errorHtml = errorHtml.concat("<b>" + errorDetails[i].name + ":</b> " + errorDetails[i].value + "<br />");
            }

            return errorHtml;
        }
    }
);
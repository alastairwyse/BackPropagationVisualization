/**
 * @name neuralNetworkDataInterfaceService
 * @desc Provides a data interface to the REST API running the neural network.
 * 
 * @param {Object} $http - AngularJS $http 
 */
app.service("neuralNetworkDataInterfaceService", ["$http", "$location", function ($http, $location) {

        /* --------------------------------------------------------------------------------
         *
         *  JSDoc callback definitions
         *
         * ------------------------------------------------------------------------------*/

        /**
         * @callback successCallback
         * @param {Object} data - The data object from the response object passed back from a successful call to $http.get()
         */

        /**
         * @callback errorCallback
         * @param {Object} data - An array of name/value pairs containing the titles and values of items describing an error situation (usually resulting from a failed called to $http.get())
         */

        /**
         * @callback inputToHiddenLayerWeightsCallback
         * @param {number[][]} inputToHiddenLayerWeights - An array of arrays of numbers containing the input to hidden layer weights
         */

        /**
         * @callback hiddenToOutputLayerWeightsCallback
         * @param {number[]} hiddenToOutputLayerWeights - An array containing the hidden to output layer weights
         */

        /**
         * @callback hiddenLayerActivationValuesCallback
         * @param {number[]} hiddenLayerActivationValues - An array containing the hidden layer activation values
         */

        /**
         * @callback outputLayerActivationValueCallback
         * @param {number} outputLayerActivationValue - The output layer activation value
         */

        /**
         * @callback costCallback
         * @param {number} cost - The cost of training
         */

        /**
         * @callback predictionCallback
         * @param {number} predictionResult - The value of a prediction (between 0 and 1)
         */


        // The base URL of the REST API
        var restApiBaseUrl = $location.protocol().concat("://");
        restApiBaseUrl = restApiBaseUrl.concat($location.host()).concat(":");
        restApiBaseUrl = restApiBaseUrl.concat($location.port()).concat("/");
        restApiBaseUrl = restApiBaseUrl.concat("api/");

        /**
         * @name collectErrorDetails
         * @desc Collects together a set of name/value pairs representing details of an error, in the case that a call to $http.get() results in an error.
         *
         * @param {string} url - The url that was requested by $http.get()
         * @param {Object} response - The response received from $http.get()
         * @returns {Object} An array of name/value pairs containing the titles and values of items in the error message.
         */
        var collectErrorDetails = function (url, response) {
            var status = "";
            var text = "";
            var message = "";
            var detail = "";
            if (angular.isUndefined(response) == false && response.data != null) {
                status = response.status;
                text = response.statusText;
                message = response.data.Message;
                detail = response.data.MessageDetail;
            }
            return [
                { name: "URL", value: url },
                { name: "Status", value: status },
                { name: "Text", value: text },
                { name: "Message", value: message },
                { name: "Detail", value: detail }
            ];
        }

        /* --------------------------------------------------------------------------------
         *
         *  'Private' base functions
         *
         *  These functions provide functionality to retrieve 'base' (i.e. fundamental) data from the neural network.
         *  As they are declared with 'var' they are private to neuralNetworkDataInterfaceService, and cannot be passed to the success callback of an $http.get() call (results in an 'undefined' error)
         *  Public equivalents of the below functions are defined later.
         *
         * ------------------------------------------------------------------------------*/

        var getInputToHiddenLayerWeightsFunction = function (successCallback, errorCallback) {

            var restApiUrl = restApiBaseUrl + "InputToHiddenLayerWeights";
            $http.get(restApiUrl)
                .then(function (response) {
                    successCallback(response.data);
                },
                function (response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };

        var getHiddenToOutputLayerWeightsFunction = function (successCallback, errorCallback) {
            var restApiUrl = restApiBaseUrl + "HiddenToOutputLayerWeights";
            $http.get(restApiUrl)
                .then(function (response) {
                    successCallback(response.data);
                },
                function (response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };

        var getHiddenLayerActivationValuesFunction = function (successCallback, errorCallback) {
            var restApiUrl = restApiBaseUrl + "HiddenLayerActivationValues";
            $http.get(restApiUrl)
                .then(function (response) {
                    successCallback(response.data);
                },
                function errorCallBack(response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };

        var getOutputLayerActivationValueFunction = function (successCallback, errorCallback) {
            var restApiUrl = restApiBaseUrl + "OutputLayerActivationValue";
            $http.get(restApiUrl)
                .then(function (response) {
                    successCallback(response.data);
                },
                function errorCallBack(response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };

        var getCostFunction = function (successCallback, errorCallback) {
            var restApiUrl = restApiBaseUrl + "Cost";
            $http.get(restApiUrl)
                .then(function (response) {
                    successCallback(response.data);
                },
                function errorCallBack(response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };


        /* --------------------------------------------------------------------------------
         *
         *  'Public' base functions
         *
         *  These are basically public wrapper functions of the private base functions defined above (retrieve 'base' data from the neural network).
         *  These functions are used directly from controller classes, aswell as being called from 'aggregate' functions defined later.
         *
         * ------------------------------------------------------------------------------*/

        /**
         * @name getInputToHiddenLayerWeights
         * @desc Gets the input to hidden layer weights from the REST API.
         *
         * @param {successCallback} successCallback - Callback function to execute when the $http.get() response becomes available
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.getInputToHiddenLayerWeights = function (successCallback, errorCallback) {
            getInputToHiddenLayerWeightsFunction(successCallback, errorCallback);
        };

        /**
         * @name getHiddenToOutputLayerWeights
         * @desc Gets the hidden to output layer weights from the REST API.
         *
         * @param {successCallback} successCallback - Callback function to execute when the $http.get() response becomes available
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.getHiddenToOutputLayerWeights = function (successCallback, errorCallback) {
            getHiddenToOutputLayerWeightsFunction(successCallback, errorCallback);
        };

        /**
         * @name getHiddenLayerActivationValues
         * @desc Gets the activation values of the hidden layer of the network from the REST API.
         *
         * @param {successCallback} successCallback - Callback function to execute when the $http.get() response becomes available
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.getHiddenLayerActivationValues = function (successCallback, errorCallback) {
            getHiddenLayerActivationValuesFunction(successCallback, errorCallback);
        };

        /**
         * @name getOutputLayerActivationValue
         * @desc Gets the activation value of the output layer of the network from the REST API.
         *
         * @param {successCallback} successCallback - Callback function to execute when the $http.get() response becomes available
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.getOutputLayerActivationValue = function (successCallback, errorCallback) {
            getOutputLayerActivationValueFunction(successCallback, errorCallback);
        };

        /**
         * @name getCost
         * @desc Gets the current cost based on the training performed so far from the REST API.
         *
         * @param {successCallback} successCallback - Callback function to execute when the $http.get() response becomes available
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.getCost = function (successCallback, errorCallback) {
            getCostFunction(successCallback, errorCallback);
        };

        /**
         * @name setLogicalOperator
         * @desc Sets the logical operator represented by the training data on the REST API.
         *
         * @param {string} logicalOperator - The logical operator represented by the neural network training data (possible values are "And", "Or", "Xor")
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.setLogicalOperator = function (logicalOperator, errorCallback) {
            var restApiUrl = restApiBaseUrl + "LogicalOperator";
            $http.put(restApiUrl, "\x22" + logicalOperator + "\x22")
                .then(function (response) {
                },
                function (response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };


        /* --------------------------------------------------------------------------------
         *
         *  'Aggreate' functions
         *
         *  These functions provide rich, aggregated functionality from the neural network.
         *  They call neuralNetworkDataInterfaceService 'base' functions as part of $http.get() success callbacks in order to populate the results of these functions back to the controller.
         *
         * ------------------------------------------------------------------------------*/

        /**
         * @name resetWeights
         * @desc Resets the weights in the network via the REST API.
         *
         * @param {inputToHiddenLayerWeightsCallback} inputToHiddenLayerWeightsCallback - Callback function to execute when the $http.get() response becomes available to update the input to hidden layer weights
         * @param {hiddenLayerActivationValuesCallback} hiddenLayerActivationValuesCallback - Callback function to execute when the $http.get() response becomes available to update the hidden layer activation values
         * @param {hiddenToOutputLayerWeightsCallback} hiddenToOutputLayerWeightsCallback - Callback function to execute when the $http.get() response becomes available to update the hidden to output layer weights
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.resetWeights = function (inputToHiddenLayerWeightsCallback, hiddenLayerActivationValuesCallback, hiddenToOutputLayerWeightsCallback, errorCallback) {
            var restApiUrl = restApiBaseUrl + "WeightReset";
            $http.get(restApiUrl, { cache: false })
                .then(function (response) {
                    getInputToHiddenLayerWeightsFunction(inputToHiddenLayerWeightsCallback, errorCallback);
                    getHiddenLayerActivationValuesFunction(hiddenLayerActivationValuesCallback, errorCallback);
                    getHiddenToOutputLayerWeightsFunction(hiddenToOutputLayerWeightsCallback, errorCallback);
                },
                function (response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };

        /**
         * @name getPrediction
         * @desc Calls the REST API to predict the result data for two input values based on the neural network's current weights.
         *
         * @param {number} inputValue1 - The first input value
         * @param {number} inputValue1 - The second input value
         * @param {predictionCallback} predictionCallback - Callback function to execute when the $http.get() response becomes available to update the prediction value
         * @param {hiddenLayerActivationValuesCallback} hiddenLayerActivationValuesCallback - Callback function to execute when the $http.get() response becomes available to update the hidden layer activation values
         * @param {outputLayerActivationValueCallback} outputLayerActivationValueCallback - Callback function to execute when the $http.get() response becomes available to update the output layer activation value
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.getPrediction = function (
            inputValue1,
            inputValue2,
            predictionCallback,
            hiddenLayerActivationValuesCallback,
            outputLayerActivationValueCallback,
            errorCallback
            ) {
            var restApiUrl = restApiBaseUrl + "Prediction?value1=" + inputValue1 + "&value2=" + inputValue2;
            $http.get(restApiUrl, { cache: false })
                .then(function (response) {
                    predictionCallback(response.data);
                    getHiddenLayerActivationValuesFunction(hiddenLayerActivationValuesCallback, errorCallback);
                    getOutputLayerActivationValueFunction(outputLayerActivationValueCallback, errorCallback);
                },
                function (response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        };

        /**
         * @name train
         * @desc Calls the REST API to train the neural network.
         *
         * @param {number} learningRate  The learning rate to use during training
         * @param {number} batchSize  The number of training cases to evaluate before updating the weights during each iteration through the training set
         * @param {number} epochs  The number of iterations through the complete training set to perform during training
         * @param {inputToHiddenLayerWeightsCallback} inputToHiddenLayerWeightsCallback  Callback function to execute when the $http.get() response becomes available to update the input to hidden layer weights
         * @param {hiddenToOutputLayerWeightsCallback} hiddenToOutputLayerWeightsCallback  Callback function to execute when the $http.get() response becomes available to update the hidden to output layer weights
         * @param {hiddenLayerActivationValuesCallback} hiddenLayerActivationValuesCallback  Callback function to execute when the $http.get() response becomes available to update the hidden layer activation values
         * @param {outputLayerActivationValueCallback} outputLayerActivationValueCallback  Callback function to execute when the $http.get() response becomes available to update the output layer activation value
         * @param {costCallback} costCallback  Callback function to execute when the $http.get() response becomes available to update the cost
         * @param {errorCallback} errorCallback - Callback function to execute if the $http.get() results in an error
         */
        this.train = function (
            learningRate, 
            batchSize, 
            epochs, 
            inputToHiddenLayerWeightsCallback, 
            hiddenToOutputLayerWeightsCallback, 
            hiddenLayerActivationValuesCallback, 
            outputLayerActivationValueCallback,
            costCallback,
            errorCallback
            ) {
            var restApiUrl = restApiBaseUrl + "Training?learningRate=" + learningRate + "&batchSize=" + batchSize + "&numberOfEpochs=" + epochs;
            $http.get(restApiUrl, { cache: false })
                .then(function (response) {
                    getInputToHiddenLayerWeightsFunction(inputToHiddenLayerWeightsCallback, errorCallback);
                    getHiddenToOutputLayerWeightsFunction(hiddenToOutputLayerWeightsCallback, errorCallback);
                    getHiddenLayerActivationValuesFunction(hiddenLayerActivationValuesCallback, errorCallback);
                    getOutputLayerActivationValueFunction(outputLayerActivationValueCallback, errorCallback);
                    getCostFunction(costCallback, errorCallback);
                },
                function (response) {
                    errorCallback(collectErrorDetails(restApiUrl, response));
                }
            );
        }
    }
]);

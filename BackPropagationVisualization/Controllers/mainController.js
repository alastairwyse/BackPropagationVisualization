/**
 * @name mainController
 * @desc The main controller for the backpropagationVisualization application.
 *
 * @param {Object} $scope - AngularJS $scope 
 * @param {Object} $mdDialog - AngularJS $mdDialog 
 * @param {Object} neuralNetworkDataInterfaceService - A service interfacing to the REST API running the neural network
 * @param {Object} utilitiesService - A service containing general utility functions
 */
app.controller("mainController", ["$scope", "$mdDialog", "neuralNetworkDataInterfaceService", "utilitiesService", function ($scope, $mdDialog, neuralNetworkDataInterfaceService, utilitiesService) {

        // Initialize local variables (should be constants)
        /** @const */
        var trainingEpochWaitDialogLimit = 7000;
        /** @const */
        var waitDialogUrl = "waitDialog.html";

        // Initialize the scope container objects
        $scope.training = [];
        $scope.prediction = [];
        $scope.training.BatchSize = 1;
        $scope.logicalOperator = "And";
        // 'dataInterfacePostExecute' object is used to run a 'postExecute' function after calls to the data interface have completed
        //   In this case it's used to hide the wait dialog after all UI components have been updated
        $scope.dataInterfacePostExecute = [];
        $scope.dataInterfacePostExecute.remainingCallbacks = 0;
        $scope.dataInterfacePostExecute.errorOccurred = false;
        $scope.dataInterfacePostExecute.waitDialogIsShowing = false;
        $scope.dataInterfacePostExecute.postExecuteFunction = function() { };
        $scope.dataInterfacePostExecute.callbackComplete = function () {
            if ($scope.dataInterfacePostExecute.errorOccurred == true) {
            }
            if ($scope.dataInterfacePostExecute.remainingCallbacks == 1 && $scope.dataInterfacePostExecute.errorOccurred == false) {
                $scope.dataInterfacePostExecute.postExecuteFunction();
            }
            $scope.dataInterfacePostExecute.remainingCallbacks--;
        };
        $scope.dataInterfacePostExecute.errorCallback = function (errorDetails) {
            if ($scope.dataInterfacePostExecute.errorOccurred == false) {
                $scope.dataInterfacePostExecute.errorOccurred = true;
                if ($scope.dataInterfacePostExecute.waitDialogIsShowing == true) {
                    $scope.hideWaitDialog();
                }
                $scope.showErrorDialog(errorDetails);
            }
        };

        neuralNetworkDataInterfaceService.setLogicalOperator($scope.logicalOperator, $scope.dataInterfacePostExecute.errorCallback);

        // Initialize the scope object holding the combined hidden layer values
        $scope.AllHiddenLayerValues = [];
        for (i = 0; i < 5; i++) {
            var emptyHiddenLayerValues = {
                inputWeights : [], 
                activationValue: 0,
                outputWeight: 0
            };
            $scope.AllHiddenLayerValues.push(emptyHiddenLayerValues);
        }

        /**
         * @name populateAllHiddenLayerValues
         * @desc Retrieves all the weights and hidden layer activation values from the neuralNetworkDataInterfaceService and combines them in to an array.
         *         Allows all of these values to be shown iteratively in a single row of an HTML table using the 'data-ng-repeat' attribute.
         */
        var populateAllHiddenLayerValues = function () {
            neuralNetworkDataInterfaceService.getInputToHiddenLayerWeights(
                function (inputToHiddenLayerWeights) {
                    $scope.setInputToHiddenLayerWeights(inputToHiddenLayerWeights);
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
            neuralNetworkDataInterfaceService.getHiddenLayerActivationValues(
                function (hiddenLayerActivationValues) {
                    $scope.setHiddenLayerActivationValues(hiddenLayerActivationValues);
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
            neuralNetworkDataInterfaceService.getHiddenToOutputLayerWeights(
                function (hiddenToOutputLayerWeights) {
                    $scope.setHiddenToOutputLayerWeights(hiddenToOutputLayerWeights);
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
        };

        /**
         * @name populateOutputLayerActivationValue
         * @desc Retrieves the output layer activation value from the neuralNetworkDataInterfaceService and sets it on the scope
         */
        var populateOutputLayerActivationValue = function () {
            neuralNetworkDataInterfaceService.getOutputLayerActivationValue(
                function (outputLayerActivationValue) {
                    $scope.OutputLayerActivationValue = outputLayerActivationValue;
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
        };

        /**
         * @name populateCost
         * @desc Retrieves the cost value from the neuralNetworkDataInterfaceService and sets it on the scope
         */
        var populateCost = function () {
            neuralNetworkDataInterfaceService.getCost(
                function (cost) {
                    $scope.Cost = cost;
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
        };

        /**
         * @name initializeWaitDialog
         * @desc Initializes values in the $scope.dataInterfacePostExecute object and shows a wait dialog in preparation for a long-running background process
         *
         * @param {number} remainingCallbacks - The number of callback which are expected to be executed after the long running process (in the case of success).  The wait dialog will be closed after this number of callbacks are completed.
         */
        var initializeWaitDialog = function (remainingCallbacks) {
            $scope.dataInterfacePostExecute.errorOccurred = false;
            $scope.dataInterfacePostExecute.remainingCallbacks = remainingCallbacks;
            $scope.dataInterfacePostExecute.postExecuteFunction = function () {
                $scope.hideWaitDialog();
            };
            $scope.showWaitDialog();
        };

        // Functions to call when the controller is initialized
        populateAllHiddenLayerValues();
        populateOutputLayerActivationValue();
        populateCost();

        /**
         * @name setLogicalOperator
         * @desc Sets the training data corresponding to the logical operator defined in $scope.logicalOperator on the neuralNetworkDataInterfaceService
         */
        $scope.setLogicalOperator = function () {
            $scope.dataInterfacePostExecute.errorOccurred = false;
            neuralNetworkDataInterfaceService.setLogicalOperator($scope.logicalOperator, $scope.dataInterfacePostExecute.errorCallback);
        };

        /**
         * @name resetWeights
         * @desc Resets the weights in the neuralNetworkDataInterfaceService and sets them on the scope
         */
        $scope.resetWeights = function () {

            $scope.dataInterfacePostExecute.errorOccurred = false;
            $scope.OutputLayerActivationValue = 0;
            $scope.Cost = 0;
            neuralNetworkDataInterfaceService.resetWeights(
                function (inputToHiddenLayerWeights) {
                    $scope.setInputToHiddenLayerWeights(inputToHiddenLayerWeights);
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                function (hiddenLayerActivationValues) {
                    $scope.resetHiddenLayerActivationValues(hiddenLayerActivationValues);
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                function (hiddenToOutputLayerWeights) {
                    $scope.setHiddenToOutputLayerWeights(hiddenToOutputLayerWeights);
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
        };

        /**
         * @name predict
         * @desc Retrieves the predicted output value based on the scope prediction input values.  Also sets the output value on the scope.
         */
        $scope.predict = function () {
            // Convert the checkbox contents to numeric values
            var inputValue1, inputValue2;
            if ($scope.prediction.CheckboxValue1 == true) {
                inputValue1 = 1.0;
            }
            else {
                inputValue1 = 0.0;
            }
            if ($scope.prediction.CheckboxValue2 == true) {
                inputValue2 = 1.0;
            }
            else {
                inputValue2 = 0.0;
            }

            $scope.dataInterfacePostExecute.errorOccurred = false;
            neuralNetworkDataInterfaceService.getPrediction(
                inputValue1,
                inputValue2,
                function (predictionResult) {
                    $scope.prediction.Result = predictionResult;
                }, 
                function (hiddenLayerActivationValues) {
                    $scope.setHiddenLayerActivationValues(hiddenLayerActivationValues);
                }, 
                function (outputLayerActivationValue) {
                    $scope.OutputLayerActivationValue = outputLayerActivationValue;
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
        };

        /**
         * @name train
         * @desc Trains the neural network based on training parameters set on the scope.  Updates the weight values, activation values, and cost on the scope when completed.
         */
        $scope.train = function () {

            if ($scope.training.Epochs > trainingEpochWaitDialogLimit) {
                initializeWaitDialog(5);
            }
            else {
                $scope.dataInterfacePostExecute.errorOccurred = false;
                $scope.dataInterfacePostExecute.remainingCallbacks = 5;
                $scope.dataInterfacePostExecute.postExecuteFunction = function () { };
            }

            neuralNetworkDataInterfaceService.train(
                $scope.training.LearningRate,
                $scope.training.BatchSize,
                $scope.training.Epochs,
                function (inputToHiddenLayerWeights) {
                    $scope.setInputToHiddenLayerWeights(inputToHiddenLayerWeights);
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                function (hiddenToOutputLayerWeights) {
                    $scope.setHiddenToOutputLayerWeights(hiddenToOutputLayerWeights);
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                function (hiddenLayerActivationValues) {
                    $scope.resetHiddenLayerActivationValues(hiddenLayerActivationValues);
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                function (outputLayerActivationValue) {
                    $scope.OutputLayerActivationValue = 0;
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                function (cost) {
                    $scope.Cost = cost;
                    $scope.dataInterfacePostExecute.callbackComplete();
                },
                $scope.dataInterfacePostExecute.errorCallback
            );
        };

        /**
         * @name setInputToHiddenLayerWeights
         * @desc Sets the input to hidden layer weights on the scope
         *
         * @param {number[][]} inputToHiddenLayerWeights - An array of arrays of numbers containing the input to hidden layer weights
         */
        $scope.setInputToHiddenLayerWeights = function (inputToHiddenLayerWeights) {
            for (i = 0; i < inputToHiddenLayerWeights.length; i++) {
                for (j = 0; j < inputToHiddenLayerWeights[i].length; j++) {
                    $scope.AllHiddenLayerValues[i].inputWeights.pop();
                }
                for (j = 0; j < inputToHiddenLayerWeights[i].length; j++) {
                    var weightValue = {
                        weight: inputToHiddenLayerWeights[i][j],
                        cellShade: utilitiesService.convertDoubleToGreyShadeColour(inputToHiddenLayerWeights[i][j]),
                        fontColour: utilitiesService.getFontColourForWeightValue(inputToHiddenLayerWeights[i][j])
                    };
                    $scope.AllHiddenLayerValues[i].inputWeights.push(weightValue);
                }
            }
        }

        /**
         * @name setHiddenToOutputLayerWeights
         * @desc Sets the hidden to output layer weights on the scope
         *
         * @param {number[]} hiddenToOutputLayerWeights - An array containing the hidden to output layer weights
         */
        $scope.setHiddenToOutputLayerWeights = function (hiddenToOutputLayerWeights) {
            for (i = 0; i < hiddenToOutputLayerWeights.length; i++) {
                var weightValue = {
                    weight: hiddenToOutputLayerWeights[i],
                    cellShade: utilitiesService.convertDoubleToGreyShadeColour(hiddenToOutputLayerWeights[i]),
                    fontColour: utilitiesService.getFontColourForWeightValue(hiddenToOutputLayerWeights[i])
                };
                $scope.AllHiddenLayerValues[i].outputWeight = weightValue;
            }
        }

        /**
         * @name setHiddenLayerActivationValues
         * @desc Sets the hidden layer activation values on the scope
         *
         * @param {number[]} hiddenLayerActivationValues - An array containing the hidden layer activation values
         */
        $scope.setHiddenLayerActivationValues = function (hiddenLayerActivationValues) {
            for (i = 0; i < hiddenLayerActivationValues.length; i++) {
                var activationValue = {
                    value: hiddenLayerActivationValues[i],
                    cellShade: utilitiesService.convertDoubleToGreyShadeColour(hiddenLayerActivationValues[i]),
                    fontColour: utilitiesService.getFontColourForWeightValue(hiddenLayerActivationValues[i])
                };
                $scope.AllHiddenLayerValues[i].activationValue = activationValue;
            }
        }

        /**
         * @name resetHiddenLayerActivationValues
         * @desc Sets the hidden layer activation values on the scope to 0
         *
         * @param {number[]} hiddenLayerActivationValues - An array containing the hidden layer activation values
         */
        $scope.resetHiddenLayerActivationValues = function (hiddenLayerActivationValues) {
            for (i = 0; i < hiddenLayerActivationValues.length; i++) {
                var activationValue = {
                    value: 0.0,
                    cellShade: "#000000",
                    fontColour: "#FFFFFF"
                };
                $scope.AllHiddenLayerValues[i].activationValue = activationValue;
            }
        }

        /**
         * @name showWaitDialog
         * @desc Displays a modal wait dialog
         */
        $scope.showWaitDialog = function() {
            var parentElement = angular.element(document.body);
            $scope.dataInterfacePostExecute.waitDialogIsShowing = true;
            $mdDialog.show({
                parent: parentElement,
                templateUrl: waitDialogUrl
            });
        }

        /**
         * @name hideWaitDialog
         * @desc Closes the wait dialog
         */
        $scope.hideWaitDialog = function () {
            $mdDialog.hide();
            $scope.dataInterfacePostExecute.waitDialogIsShowing = false;
        }

        /**
         * @name showErrorDialog
         * @desc Displays a modal error dialog
         *
         * @param {Object} errorDetails - A set of key/value pairs representing details of the error
         */
        $scope.showErrorDialog = function (errorDetails) {
            var parentElement = angular.element(document.body);
            $mdDialog.show(
                $mdDialog.alert()
                    .parent(parentElement)
                    .clickOutsideToClose(false)
                    .title("Error")
                    .htmlContent(utilitiesService.convertErrorValuesToHtml(errorDetails))
                    .ariaLabel("errorDialog")
                    .ok("OK")
            );
        }
    }
]);
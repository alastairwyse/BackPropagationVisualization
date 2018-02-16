/*
 * Copyright 2018 Alastair Wyse (https://github.com/alastairwyse/BackPropagationVisualization/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using System.Web;
using BackPropagationVisualization.Models;

namespace BackPropagationVisualization.Controllers
{
    /// <summary>
    /// A controller which exposes methods to interact with a feed forward neural network.
    /// </summary>
    [RoutePrefix("api")]
    public class NeuralNetworkController : ApiController
    {
        private IFeedForwardNeuralNetwork neuralNetwork;
        private const String targetValuesApplicationObjectKey = "TargetValues";
        private Double[,] trainingData = new Double[4, 2]
            {
                { 0.0, 0.0 }, 
                { 1.0, 0.0 }, 
                { 0.0, 1.0 }, 
                { 1.0, 1.0 }, 
            };

        /// <summary>
        /// Initialises a new instance of the BackPropagationVisualization.Controllers.NeuralNetworkController class.
        /// </summary>
        public NeuralNetworkController()
        {
            this.neuralNetwork = new NeuralNetworkApplicationProxy();
        }

        /// <summary>
        /// Initialises a new instance of the BackPropagationVisualization.Controllers.NeuralNetworkController class.
        /// </summary>
        /// <param name="neuralNetwork">A test (mock) IFeedForwardNeuralNetwork object.</param>
        public NeuralNetworkController(IFeedForwardNeuralNetwork neuralNetwork)
            : this()
        {
            this.neuralNetwork = neuralNetwork;
        }

        /// <summary>
        /// Returns the values of the weights between the input and hidden layers of the network.  The first dimension represents the input units, and the second dimension the hidden units.
        /// </summary>
        /// <returns>The weights between the input and hidden layers of the network.</returns>
        [Route("InputToHiddenLayerWeights")]
        [HttpGet]
        public Double[][] GetInputToHiddenLayerWeights()
        {
            Double[][] weights = Convert2dArrayToArrayOfArrays(neuralNetwork.InputToHiddenLayerWeights);

            return weights;
        }

        /// <summary>
        /// Returns the values of the weights between the hidden and output layers of the network.
        /// </summary>
        /// <returns>The weights between the hidden and output layers of the network.</returns>
        [Route("HiddenToOutputLayerWeights")]
        [HttpGet]
        public Double[] GetHiddenToOutputLayerWeights()
        {
            Double[,] twoDimensionalWeights = neuralNetwork.HiddenToOutputLayerWeights;
            Double[] returnArray = new Double[twoDimensionalWeights.GetLength(1)];
            for (Int32 i = 0; i < returnArray.Length; i++)
            {
                returnArray[i] = twoDimensionalWeights[0, i];
            }

            return returnArray;
        }

        /// <summary>
        /// Returns the activation values of the hidden layer of the network.
        /// </summary>
        /// <returns>The activation values of the hidden layer of the network.</returns>
        [Route("HiddenLayerActivationValues")]
        [HttpGet]
        public Double[] GetHiddenLayerActivationValues()
        {
            return neuralNetwork.HiddenLayerActivationValues;
        }

        /// <summary>
        /// Returns the activation value of the output layer of the network.
        /// </summary>
        /// <returns>The activation value of the output layer of the network.</returns>
        [Route("OutputLayerActivationValue")]
        [HttpGet]
        public Double GetOutputLayerActivationValue()
        {
            return neuralNetwork.OutputLayerActivationValues[0];
        }

        /// <summary>
        /// Returns the current cost based on the training performed so far.
        /// </summary>
        /// <returns>The cost.</returns>
        [Route("Cost")]
        [HttpGet]
        public Double GetCost()
        {
            return neuralNetwork.Cost;
        }

        /// <summary>
        /// Sets the network training data to the specified logical operator.
        /// </summary>
        /// <param name="logicalOperator">The training data equivalent to the specified logical operator to use for training the network.</param>
        [Route("LogicalOperator")]
        [HttpPut]
        public HttpResponseMessage SetLogicalOperator([FromBody]String logicalOperator)
        {
            LogicalOperator logicalOperatorEnum;
            Double[,] targetValues;

            try
            {
                logicalOperatorEnum = (LogicalOperator)Enum.Parse(typeof(LogicalOperator), logicalOperator, true);
            }
            catch (Exception e)
            {
                String errorMessage = "Failed to convert string '" + logicalOperator + "' to an Enum of type LogicalOperator.";
                return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, errorMessage);
            }

            switch (logicalOperatorEnum)
            {
                case LogicalOperator.And:
                    targetValues = new Double[4, 1]
                    {
                        { 0.0 }, 
                        { 0.0 }, 
                        { 0.0 }, 
                        { 1.0 }
                    };
                    break;
                case LogicalOperator.Or:
                    targetValues = new Double[4, 1]
                    {
                        { 0.0 }, 
                        { 1.0 }, 
                        { 1.0 }, 
                        { 1.0 }
                    };
                    break;
                case LogicalOperator.Xor:
                    targetValues = new Double[4, 1]
                    {
                        { 0.0 }, 
                        { 1.0 }, 
                        { 1.0 }, 
                        { 0.0 }
                    };
                    break;
                default:
                    String errorMessage = "Unhandled LogicalOperator enum '" + Enum.GetName(typeof(LogicalOperator), logicalOperatorEnum) + "'.";
                    return Request.CreateErrorResponse(HttpStatusCode.InternalServerError, errorMessage);
            }

            HttpContext.Current.Application.Remove(targetValuesApplicationObjectKey);
            HttpContext.Current.Application.Add(targetValuesApplicationObjectKey, targetValues);

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        /// <summary>
        /// Resets the weights in the network.
        /// </summary>
        [Route("WeightReset")]
        [HttpGet]
        public void ResetWeights()
        {
            neuralNetwork.InitialiseWeights();
        }
        
        /// <summary>
        /// Predicts an output for the specified input values based on the weights in the network.
        /// </summary>
        /// <param name="value1">The first input value.</param>
        /// <param name="value2">The second input value.</param>
        /// <returns>The predicted output value.</returns>
        [Route("Prediction")]
        [HttpGet]
        public Double Predict(Double value1, Double value2)
        {
            Double[,] parameterData = new Double[1, 2]
            {
                { value1, value2 }
            };
            return neuralNetwork.Predict(parameterData)[0, 0];
        }
        
        /// <summary>
        /// Trains the neural network.
        /// </summary>
        /// <param name="learningRate">The learning rate to use during training.</param>
        /// <param name="batchSize">The number of training cases to evaluate before updating the weights during each iteration through the training set.</param>
        /// <param name="numberOfEpochs">The number of iterations through the complete training set to perform during training.</param>
        [Route("Training")]
        [HttpGet]
        public void Train(Double learningRate, Int32 batchSize, Int32 numberOfEpochs)
        {
            Double[,] targetValues = (Double[,])HttpContext.Current.Application[targetValuesApplicationObjectKey];
            neuralNetwork.Train(trainingData, targetValues, learningRate, batchSize, numberOfEpochs, false);
        }
        
        #region Private Methods

        /// <summary>
        /// Converts a 2-dimensional array of doubles to an array of arrays.
        /// </summary>
        /// <param name="inputArray">The 2-dimensional array to convert.</param>
        /// <returns>The equivalent array of arrays.</returns>
        private Double[][] Convert2dArrayToArrayOfArrays(Double[,] inputArray)
        {
            Double[][] returnArray = new Double[inputArray.GetLength(0)][];
            for (Int32 i = 0; i < inputArray.GetLength(0); i++)
            {
                Double[] currentArray = new Double[inputArray.GetLength(1)];
                for (Int32 j = 0; j < inputArray.GetLength(1); j++)
                {
                    currentArray[j] = inputArray[i, j];
                }
                returnArray[i] = currentArray;
            }

            return returnArray;
        }

        #endregion Private Methods
    }

    /// <summary>
    /// Represents a logical operator.
    /// </summary>
    public enum LogicalOperator
    {
        /// <summary>Logical AND</summary>
        And,
        /// <summary>Logical OR</summary>
        Or,
        /// <summary>Logical XOR</summary>
        Xor
    }
}

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
using System.IO;
using System.Threading.Tasks;
using System.Web.Http;
using System.Net;
using System.Net.Http;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using BackPropagationVisualization.Models;
using BackPropagationVisualization.Controllers;
using NMock2;

namespace BackPropagationVisualization.UnitTests
{
    /// <summary>
    /// Unit tests for the BackPropagationVisualization.NeuralNetworkController class.
    /// </summary>
    [TestClass]
    public class NeuralNetworkControllerTests
    {
        private Mockery mockery;
        private IFeedForwardNeuralNetwork mockNeuralNetwork;
        private NeuralNetworkController testNeuralNetworkController;

        [TestInitialize]
        public void SetUp()
        {
            mockery = new Mockery();
            mockNeuralNetwork = mockery.NewMock<IFeedForwardNeuralNetwork>();
            testNeuralNetworkController = new NeuralNetworkController(mockNeuralNetwork);
        }

        /// <summary>
        /// Success tests for the GetInputToHiddenLayerWeights() method.
        /// </summary>
        [TestMethod]
        public void GetInputToHiddenLayerWeights()
        {
            Double[,] twoDimensionalReturnedWeights = new Double[3, 4]
            {
                { 0.1, 0.2, 0.3, 0.4 }, 
                { 0.5, 0.6, 0.7, 0.8 }, 
                { 0.9, 0.11, 0.12, 0.13 }
            };

            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).GetProperty("InputToHiddenLayerWeights").Will(Return.Value(twoDimensionalReturnedWeights));
            }

            Double[][] result = testNeuralNetworkController.GetInputToHiddenLayerWeights();

            Assert.AreEqual(3, result.Length);
            Assert.AreEqual(4, result[0].Length);
            Assert.AreEqual(0.1, result[0][0]);
            Assert.AreEqual(0.2, result[0][1]);
            Assert.AreEqual(0.3, result[0][2]);
            Assert.AreEqual(0.4, result[0][3]);
            Assert.AreEqual(0.5, result[1][0]);
            Assert.AreEqual(0.6, result[1][1]);
            Assert.AreEqual(0.7, result[1][2]);
            Assert.AreEqual(0.8, result[1][3]);
            Assert.AreEqual(0.9, result[2][0]);
            Assert.AreEqual(0.11, result[2][1]);
            Assert.AreEqual(0.12, result[2][2]);
            Assert.AreEqual(0.13, result[2][3]);
            mockery.VerifyAllExpectationsHaveBeenMet();
        }

        /// <summary>
        /// Success tests for the GetHiddenToOutputLayerWeights() method.
        /// </summary>
        [TestMethod]
        public void GetHiddenToOutputLayerWeights()
        {
            Double[,] twoDimensionalReturnedWeights = new Double[2, 3]
            {
                { 0.1, 0.2, 0.3 }, 
                { 0.5, 0.6, 0.7 }
            };

            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).GetProperty("HiddenToOutputLayerWeights").Will(Return.Value(twoDimensionalReturnedWeights));
            }

            Double[] result = testNeuralNetworkController.GetHiddenToOutputLayerWeights();

            Assert.AreEqual(3, result.Length);
            Assert.AreEqual(0.1, result[0]);
            Assert.AreEqual(0.2, result[1]);
            Assert.AreEqual(0.3, result[2]);
            mockery.VerifyAllExpectationsHaveBeenMet();
        }

        /// <summary>
        /// Success tests for the GetHiddenLayerActivationValues() method.
        /// </summary>
        [TestMethod]
        public void GetHiddenLayerActivationValues()
        {
            Double[] returnedActivationValues = new Double[] { 0.1, 0.2, 0.3, 0.4 };

            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).GetProperty("HiddenLayerActivationValues").Will(Return.Value(returnedActivationValues));
            }

            Double[] result = testNeuralNetworkController.GetHiddenLayerActivationValues();

            Assert.AreEqual(4, result.Length);
            Assert.AreEqual(0.1, result[0]);
            Assert.AreEqual(0.2, result[1]);
            Assert.AreEqual(0.3, result[2]);
            Assert.AreEqual(0.4, result[3]);
            mockery.VerifyAllExpectationsHaveBeenMet();
        }


        /// <summary>
        /// Success tests for the GetOutputLayerActivationValue() method.
        /// </summary>
        [TestMethod]
        public void GetOutputLayerActivationValue()
        {
            Double[] returnedActivationValues = new Double[] { 0.5, 0.6, 0.7, 0.8 };

            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).GetProperty("OutputLayerActivationValues").Will(Return.Value(returnedActivationValues));
            }

            Double result = testNeuralNetworkController.GetOutputLayerActivationValue();

            Assert.AreEqual(0.5, result);
            mockery.VerifyAllExpectationsHaveBeenMet();
        }

        /// <summary>
        /// Success tests for the GetCost() method.
        /// </summary>
        [TestMethod]
        public void GetCost()
        {
            Double returnedCost = 0.6;

            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).GetProperty("Cost").Will(Return.Value(returnedCost));
            }

            Double result = testNeuralNetworkController.GetCost();

            Assert.AreEqual(0.6, result);
            mockery.VerifyAllExpectationsHaveBeenMet();
        }

        /// <summary>
        /// Tests that an exception is thrown when the SetLogicalOperator() method is called with and invalid 'logicalOperator' parameter.
        /// </summary>
        [TestMethod]
        public async Task SetLogicalOperator_InvalidLogicalOperator()
        {
            testNeuralNetworkController.Request = new HttpRequestMessage();
            testNeuralNetworkController.Configuration = new HttpConfiguration();

            HttpResponseMessage response = testNeuralNetworkController.SetLogicalOperator("AN");
            String responseMessage = await response.Content.ReadAsStringAsync();

            Assert.IsFalse(response.IsSuccessStatusCode);
            Assert.AreEqual(HttpStatusCode.InternalServerError, response.StatusCode);
            Assert.AreEqual("Failed to convert string 'AN' to an Enum of type LogicalOperator.", responseMessage.Substring(12, 65));
        }

        /// <summary>
        /// Success tests for the SetLogicalOperator() method.
        /// </summary>
        public void SetLogicalOperator()
        {
            // TODO: Need to see if I can get this test working.  Assume it is breaking because method under test is trying to access HttpContext.Current.Application.

            testNeuralNetworkController.Request = new HttpRequestMessage();
            testNeuralNetworkController.Configuration = new HttpConfiguration();

            Object[] expectedTrainArguments = new Object[6]
            {
                new Double [,] { {} }, 
                new Double [,] { {} }, 
                0.0, 
                1, 
                1, 
                false
            };

            expectedTrainArguments[1] = new Double[4, 1]
            {
                { 0.0 }, 
                { 0.0 }, 
                { 0.0 }, 
                { 1.0 }
            };

            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).Method("Train").With(expectedTrainArguments);
            }

            testNeuralNetworkController.SetLogicalOperator("Or");
            testNeuralNetworkController.Train(0.0, 1, 1);

            mockery.VerifyAllExpectationsHaveBeenMet();
        }

        /// <summary>
        /// Success tests for the ResetWeights() method.
        /// </summary>
        [TestMethod]
        public void ResetWeights()
        {
            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).Method("InitialiseWeights").WithNoArguments();
            }

            testNeuralNetworkController.ResetWeights();

            mockery.VerifyAllExpectationsHaveBeenMet();
        }

        /// <summary>
        /// Success tests for the Predict() method.
        /// </summary>
        [TestMethod]
        public void Predict()
        {
            Double[,] parameterData = new Double[1, 2]
            {
                { 0.9, 0.11 }
            };

            Double[,] returnData = new Double[2, 2]
            {
                { 0.13, 0.14 },
                { 0.15, 0.16 }
            };

            using (mockery.Ordered)
            {
                Expect.Once.On(mockNeuralNetwork).Method("Predict").With(parameterData).Will(Return.Value(returnData));
            }

            Double result = testNeuralNetworkController.Predict(0.9, 0.11);

            Assert.AreEqual(0.13, result);
            mockery.VerifyAllExpectationsHaveBeenMet();
        }

        /// <summary>
        /// Success tests for the Train() method.
        /// </summary>
        public void Train()
        {
            // TODO: Test class also has dependency on HttpContext.Current.Application in Train().  Need to see if I can remove dependency.
        }
    }
}

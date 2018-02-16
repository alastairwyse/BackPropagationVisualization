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
using System.Web;
using SimpleML;

namespace BackPropagationVisualization.Models
{
    /// <summary>
    /// An implementation of IFeedForwardNeuralNetwork, which attempts to utilise a SimpleML.BasicFeedForwardNeuralNetwork stored in the ASP.NET Application cache object.
    /// </summary>
    public class NeuralNetworkApplicationProxy : IFeedForwardNeuralNetwork
    {
        private const String neuralNetworkApplicationObjectKey = "NeuralNetwork";

        /// <summary>
        /// Initialises a new instance of the BackPropagationVisualization.Models.NeuralNetworkApplicationProxy class.
        /// </summary>
        public NeuralNetworkApplicationProxy()
        {
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.InputToHiddenLayerWeights"]/*'/>
        public double[,] InputToHiddenLayerWeights
        {
            get 
            {
                return GetNeuralNetworkFromApplication().InputToHiddenLayerWeights;
            }
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.HiddenToOutputLayerWeights"]/*'/>
        public double[,] HiddenToOutputLayerWeights
        {
            get
            {
                return GetNeuralNetworkFromApplication().HiddenToOutputLayerWeights;
            }
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.HiddenLayerActivationValues"]/*'/>
        public double[] HiddenLayerActivationValues
        {
            get
            {
                return GetNeuralNetworkFromApplication().HiddenLayerActivationValues;
            }
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.OutputLayerActivationValues"]/*'/>
        public double[] OutputLayerActivationValues
        {
            get
            {
                return GetNeuralNetworkFromApplication().OutputLayerActivationValues;
            }
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.Cost"]/*'/>
        public double Cost
        {
            get
            {
                return GetNeuralNetworkFromApplication().Cost;
            }
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="M:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.InitialiseWeights"]/*'/>
        public void InitialiseWeights()
        {
            GetNeuralNetworkFromApplication().InitialiseWeights();
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="M:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.Train(System.Double[0:,0:],System.Double[0:,0:],System.Double,System.Int32,System.Int32,System.Boolean)"]/*'/>
        public void Train(double[,] trainingData, double[,] targetValues, double learningRate, int batchSize, int numberOfEpochs, bool keepCostHistory)
        {
            BasicFeedForwardNeuralNetwork neuralNetwork = GetNeuralNetworkFromApplication();
            neuralNetwork.Train(trainingData, targetValues, learningRate, batchSize, numberOfEpochs, keepCostHistory);
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="M:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.Predict(System.Double[0:,0:])"]/*'/>
        public Double[,] Predict(Double[,] inputData)
        {
            return GetNeuralNetworkFromApplication().Predict(inputData);
        }

        #region Private Methods

        /// <summary>
        /// Retrieves the neural network from the Application object.
        /// </summary>
        /// <returns>The neural network.</returns>
        private BasicFeedForwardNeuralNetwork GetNeuralNetworkFromApplication()
        {
            return (BasicFeedForwardNeuralNetwork)HttpContext.Current.Application[neuralNetworkApplicationObjectKey];
        }

        #endregion
    }
}
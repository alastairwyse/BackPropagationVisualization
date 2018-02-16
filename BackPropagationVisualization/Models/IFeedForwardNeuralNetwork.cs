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
using System.Text;
using System.Threading.Tasks;

namespace BackPropagationVisualization.Models
{
    /// <summary>
    /// An abstraction of the SimpleML.BasicFeedForwardNeuralNetwork class, to facilitate mocking and unit testing.
    /// </summary>
    public interface IFeedForwardNeuralNetwork
    {
        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.InputToHiddenLayerWeights"]/*'/>
        Double[,] InputToHiddenLayerWeights
        {
            get;
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.HiddenToOutputLayerWeights"]/*'/>
        Double[,] HiddenToOutputLayerWeights
        {
            get;
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.HiddenLayerActivationValues"]/*'/>
        Double[] HiddenLayerActivationValues
        {
            get;
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.OutputLayerActivationValues"]/*'/>
        Double[] OutputLayerActivationValues
        {
            get;
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="P:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.Cost"]/*'/>
        Double Cost
        {
            get;
        }

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="M:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.InitialiseWeights"]/*'/>
        void InitialiseWeights();

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="M:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.Train(System.Double[0:,0:],System.Double[0:,0:],System.Double,System.Int32,System.Int32,System.Boolean)"]/*'/>
        void Train(Double[,] trainingData, Double[,] targetValues, Double learningRate, Int32 batchSize, Int32 numberOfEpochs, Boolean keepCostHistory);

        /// <include file='InterfaceDocumentationComments.xml' path='doc/members/member[@name="M:BackPropagationVisualization.Models.IFeedForwardNeuralNetwork.Predict(System.Double[0:,0:])"]/*'/>
        Double[,] Predict(Double[,] inputData);
    }
}

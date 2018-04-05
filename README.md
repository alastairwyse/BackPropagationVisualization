BackPropagationVisualization
---

![Screenshot](http://oraclepermissiongenerator.net/backpropagationvisualization/images/screenshot-small.png)

BackPropagationVisualization is a web application which shows the weights and activation values in a basic neural network, and allows you to observe changes in these values as the network is trained. The neural network learns how to apply basic logic functions AND, OR, and XOR, and hence has just 2 input units and a single output unit, with a single layer of 5 hidden units. The training algorithm uses gradient descent with backpropagation, and the only form of regularization being adjustment of the learning rate... avoiding more advanced techniques like early stopping, momentum, weight decay, etc... to keep the training process and the code simple and easy to follow.

The neural network is implemented as part of a .NET class library (the BasicFeedForwardNeuralNetwork class from the [SimpleML](https://github.com/alastairwyse/SimpleML/) project). The backend of the application is built as an ASP.NET Web API, whilst the frontend/presentation is written in AngularJS, using Google Material Design components.

A Jenkins pipeline/job is included for dependency resolution and build, running unit tests, and deploying the package web page to AWS Elastic Beanstalk.

##### Links

For detailed information including an explanation of the backpropagation process see...

[http://oraclepermissiongenerator.net/backpropagationvisualization/](http://oraclepermissiongenerator.net/backpropagationvisualization/)
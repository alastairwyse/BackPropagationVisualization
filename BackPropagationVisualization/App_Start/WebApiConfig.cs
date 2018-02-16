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
using System.Web.Http;
using System.Net.Http.Headers;

namespace BackPropagationVisualization
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API configuration and services
            // Change config to support/return only JSON
            MediaTypeHeaderValue xmlMediaType = config.Formatters.XmlFormatter.SupportedMediaTypes.FirstOrDefault(mediaTypeHeaderValue => { return mediaTypeHeaderValue.MediaType == "application/xml"; });
            config.Formatters.XmlFormatter.SupportedMediaTypes.Remove(xmlMediaType);
            config.Formatters.JsonFormatter.SupportedMediaTypes.Add(new MediaTypeHeaderValue("application/json"));

            // Web API routes
            config.MapHttpAttributeRoutes();

            /*
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
             */
        }
    }
}

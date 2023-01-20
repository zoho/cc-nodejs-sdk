License
=======

    Copyright (c) 2021, ZOHO CORPORATION PRIVATE LIMITED 
    All rights reserved. 

    Licensed under the Apache License, Version 2.0 (the "License"); 
    you may not use this file except in compliance with the License. 
    You may obtain a copy of the License at 
    
        http://www.apache.org/licenses/LICENSE-2.0 
    
    Unless required by applicable law or agreed to in writing, software 
    distributed under the License is distributed on an "AS IS" BASIS, 
    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. 
    See the License for the specific language governing permissions and 
    limitations under the License.

# ZOHOCRM PATHFINDER NODEJS SDK 1.0

## Table Of Contents

* [Overview](#overview)
* [Environmental Setup](#environmental-setup)
* [Including the SDK in your project](#including-the-sdk-in-your-project)
* [Configuration](#configuration)
* [Initialization](#initializing-the-application)
* [Responses And Exceptions](#responses-and-exceptions)
* [Sample Code](#sdk-sample-code)

## Overview

Zoho CRM NodeJS SDK offers a way to create client NodeJS applications that can be integrated with Zoho CRM PathFinder.

## Environmental Setup

NodeJS SDK is installable through **npm**. **npm** is a tool for dependency management in NodeJS. SDK expects the following from the client app.

- Client app must have Node(version 12 and above)

- NodeJS SDK must be installed into client app through **npm**.

## Including the SDK in your project

You can include the SDK to your project using:

- Install **Node** from [nodejs.org](https://nodejs.org/en/download/) (if not installed).

- Install **NodeJS SDK**
    - Navigate to the workspace of your client app.
    - Run the command below:

    ```sh
    npm install @cc/cc-nodejs-sdk
    ```
- The NodeJS SDK will be installed and a package named **@cc/cc-nodejs-sdk** will be created in the local machine.

- Another method to install the SDK
    - Add dependencies to the package.json of the node server with the latest version (recommended)
    - Run **npm install** in the directory which installs all the dependencies mentioned in package.json.

## Configuration

Before you get started with creating your NodeJS application, you need to create a SDK configuration in ZOHOCRM PathFinder.

----

- Configure API environment which decides the domain and the URL to make API calls.

    ```js
    const USDataCenter = require( "@cc/cc-nodejs-sdk/routes/dc/us_data_center").USDataCenter;

    const EUDataCenter = require( "@cc/cc-nodejs-sdk/routes/dc/eu_data_center").EUDataCenter;
    /*
     * Configure the environment
     * which is of the pattern Domain.Environment
     * Available Domains: USDataCenter, EUDataCenter, INDataCenter, CNDataCenter, AUDataCenter
     * Available Environments: PRODUCTION()
    */
    let environment = USDataCenter.PRODUCTION();
    ```


- Create an instance of **SDKConfig** containing the SDK configuration.

    ```js
    const SDKConfigBuilder = require("@cc/cc-nodejs-sdk/routes/sdk_config_builder").SDKConfigBuilder;

    /*
     * By default, the SDK creates the SDKConfig instance
     */
    let sdkConfig = new SDKConfigBuilder().build();
    ```

## Initializing the Application

Initialize the SDK using the following code.

```js
const InitializeBuilder = require("@cc/cc-nodejs-sdk/routes/initialize_builder").InitializeBuilder;
const USDataCenter = require("@cc/cc-nodejs-sdk/routes/dc/us_data_center").USDataCenter;
const SDKConfigBuilder = require("@cc/cc-nodejs-sdk/routes/sdk_config_builder").SDKConfigBuilder;

class Initializer {

    static async initialize() {

       /*
	    * Configure the environment
	    * which is of the pattern Domain.Environment
	    * Available Domains: USDataCenter, EUDataCenter, INDataCenter, CNDataCenter, AUDataCenter
	    * Available Environments: PRODUCTION()
	    */
        let environment = USDataCenter.PRODUCTION();

       /*
        * By default, the SDK creates the SDKConfig instance
        */
        let sdkConfig = new SDKConfigBuilder().build();

       /*
        * Set the following in InitializeBuilder
        * environment -> Environment instance
        * SDKConfig -> SDKConfig instance
        */
        (await new InitializeBuilder())
            .environment(environment)
            .SDKConfig(sdkConfig)
            .initialize();

    }
}

Initializer.initialize();
```

- You can now access the functionalities of the SDK. Refer to the sample codes to make various API calls through the SDK.

## Responses and Exceptions

All SDK method calls return an instance of **[APIResponse](routes/controllers/api_response.js)**.

After a successful API request, the **getObject()** method returns an instance of the APIGET (for **GET**).

**APIGET** (for **GET** requests) are the expected objects for Zoho CRM PathFinder APIs’ responses

All other exceptions such as SDK anomalies and other unexpected behaviours are thrown under the **[SDKException](core/com/zoho/crm/api/exception/sdk_exception.js)** class.

## SDK Sample code

```js
const fs = require("fs");
const path = require("path");
const InitializeBuilder = require("sdk/routes/initialize_builder").InitializeBuilder;
const USDataCenter = require("sdk/routes/dc/us_data_center").USDataCenter;
const SDKConfigBuilder = require("sdk/routes/sdk_config_builder").SDKConfigBuilder;
const HeaderMap = require("sdk/routes/header_map").HeaderMap;
const ParameterMap = require("sdk/routes/parameter_map").ParameterMap;
const Param = require("sdk/routes/param").Param;
const ApiTriggerOperations = require("sdk/core/com/zoho/crm/api_trigger/api_trigger_operations").ApiTriggerOperations;
const GetAPITriggerParam = require("sdk/core/com/zoho/crm/api_trigger/api_trigger_operations").GetAPITriggerParam;
class Initializer {

    static async initialize() {

        /*
	    * Configure the environment
	    * which is of the pattern Domain.Environment
	    * Available Domains: USDataCenter, EUDataCenter, INDataCenter, CNDataCenter, AUDataCenter
	    * Available Environments: PRODUCTION()
	    */
        let environment = USDataCenter.PRODUCTION();

       /*
        * By default, the SDK creates the SDKConfig instance
        */
        let sdkConfig = new SDKConfigBuilder().build();

       
        try {
           /*
            * Set the following in InitializeBuilder
            * environment -> Environment instance
            * SDKConfig -> SDKConfig instance
            */
            (await new InitializeBuilder())
                .environment(environment)
                .SDKConfig(sdkConfig)
                .initialize();
        } catch (error) {
            console.log(error);
        }
        
        let paramInstance = new ParameterMap();
        //Pass Processname, Statename, Digestkey configured in the CRM PathFinder and pass dynamic Identifiers and Params to that PathFinder Process
        await paramInstance.add(GetAPITriggerParam.PROCESSNAME, "sdkprocess");
		await paramInstance.add(GetAPITriggerParam.STATENAME, "state1");
		await paramInstance.add(GetAPITriggerParam.DIGESTKEY, "15542307");
		await paramInstance.add(GetAPITriggerParam.IDENTIFIER1, "a1");
        await paramInstance.add(GetAPITriggerParam.IDENTIFIER2, "a2");
        await paramInstance.add(GetAPITriggerParam.IDENTIFIER3, "a3");
        //Supported dataTypes for Param: String, Integer, Boolean, DateTime, Date
		await paramInstance.add(new Param("stringparam", "String"), "xyz");
        await paramInstance.add(new Param("integerparam", "Integer"), 12345678901);
        //await paramInstance.add(new Param("booleanparam", "Boolean"), true);
        //await paramInstance.add(new Param("dateparam", "Date"), new Date(2022, 11, 15));
        //let startDateTime = new Date(2022, 11, 15, 18, 1, 10, 0);
        //await paramInstance.add(new Param("datetimeparam", "DateTime"), startDateTime);
    
        let apiTrigOperations = new ApiTriggerOperations();
        try{
            //Checks the response of an API
            let response = await apiTrigOperations.getAPITriggerWithParam(paramInstance);
            console.log(response.getObject().getMessage());
        }catch (ex) {
            console.log(ex);
        }
    }
}

Initializer.initialize();
```

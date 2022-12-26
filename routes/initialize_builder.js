const Constants = require('../utils/util/constants').Constants;

const SDKException = require('../routes/exception/sdk_exception').SDKException;

const SDKConfig = require('./sdk_config').SDKConfig;

const Environment = require("../routes/dc/environment").Environment;

const Initializer = require('./initializer').Initializer;

const fs = require("fs");

const path = require("path");

const { Logger, Levels } = require("./logger/logger");

const LogBuilder = require("./logger/log_builder").LogBuilder;

const SDKConfigBuilder = require("../routes/sdk_config_builder").SDKConfigBuilder;

const RequestProxy = require('./request_proxy').RequestProxy;

class InitializeBuilder {
    _environment;

    _requestProxy;

    _sdkConfig;

    _logger;

    errorMessage;

    initializer;

    constructor() {
        return (async () => {
            this.initializer = await Initializer.getInitializer();

            this.errorMessage = (await this.initializer != null) ? Constants.SWITCH_USER_ERROR : Constants.INITIALIZATION_ERROR;

            if (this.initializer != null) {

                this._environment = await this.initializer.getEnvironment();

                this._sdkConfig = await this.initializer.getSDKConfig();
            }
            return this;
        })();
    }

    initialize() {

        InitializeBuilder.assertNotNull(this._environment, this.errorMessage, Constants.ENVIRONMENT_ERROR_MESSAGE);

        if(this._sdkConfig == null) {
            this._sdkConfig = new SDKConfigBuilder().build();
        }
        
        Initializer.initialize(this._environment, this._sdkConfig, this._logger, this._requestProxy);
    }

    switchUser() {
        InitializeBuilder.assertNotNull(Initializer.getInitializer(), Constants.SDK_UNINITIALIZATION_ERROR, Constants.SDK_UNINITIALIZATION_MESSAGE);

        Initializer.switchUser(this._environment, this._sdkConfig, this._requestProxy);
    }

    logger(logger) {
        if (logger != null && !(logger instanceof Logger)) {
            let error = {};

            error[Constants.ERROR_HASH_FIELD] = Constants.LOGGER;

            error[Constants.ERROR_HASH_EXPECTED_TYPE] = Logger.name;

            throw new SDKException(Constants.INITIALIZATION_ERROR, Constants.INITIALIZATION_EXCEPTION, error);
        }

        this._logger = logger;

        return this;
    }

    SDKConfig(sdkConfig) {
        if (sdkConfig != null && !(sdkConfig instanceof SDKConfig)) {
            let error = {};

            error[Constants.ERROR_HASH_FIELD] = Constants.SDK_CONFIG;

            error[Constants.ERROR_HASH_EXPECTED_TYPE] = SDKConfig.name;

            throw new SDKException(Constants.INITIALIZATION_ERROR, Constants.INITIALIZATION_EXCEPTION, error);
        }

        this._sdkConfig = sdkConfig;

        return this;
    }

    requestProxy(requestProxy) {
        if (requestProxy != null && !(requestProxy instanceof RequestProxy)) {
            let error = {};

            error[Constants.ERROR_HASH_FIELD] = Constants.REQUEST_PROXY;

            error[Constants.ERROR_HASH_EXPECTED_TYPE] = RequestProxy.name;

            throw new SDKException(Constants.INITIALIZATION_ERROR, Constants.INITIALIZATION_EXCEPTION, error);
        }

        this._requestProxy = requestProxy;

        return this;
    }

    environment(environment) {
        InitializeBuilder.assertNotNull(environment, this.errorMessage, Constants.ENVIRONMENT_ERROR_MESSAGE);

        if (!(environment instanceof Environment)) {
            let error = {};

            error[Constants.ERROR_HASH_FIELD] = Constants.ENVIRONMENT;

            error[Constants.ERROR_HASH_EXPECTED_TYPE] = Environment.name;

            throw new SDKException(Constants.INITIALIZATION_ERROR, Constants.INITIALIZATION_EXCEPTION, error);
        }

        this._environment = environment;

        return this;
    }

    static async assertNotNull(value, errorCode, errorMessage) {
        if (value == null) {
            throw new SDKException(errorCode, errorMessage);
        }
    }
}

module.exports = {
    MasterModel: InitializeBuilder,
    InitializeBuilder: InitializeBuilder
}
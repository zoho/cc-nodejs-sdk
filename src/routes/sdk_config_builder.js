const SDKConfig = require('./sdk_config').SDKConfig;

class SDKConfigBuilder {
    _timeout = 0;

    /**
     * This is a setter method to set API timeout.
     * @param {number} timeout
     * @returns {SDKConfigBuilder} An instance of SDKConfigBuilder
     */
    timeout(timeout) {
        this._timeout = timeout > 0 ? timeout : 0;

        return this;
    }

    /**
     * The method to build the SDKConfig instance
     * @returns {SDKConfig} An instance of SDKConfig
     */
    build() {
        return new SDKConfig(this._timeout);
    }
}

module.exports = {
    MasterModel: SDKConfigBuilder,
    SDKConfigBuilder: SDKConfigBuilder
}
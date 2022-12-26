/**
 * The class to configure the SDK.
 */
class SDKConfig {
    _timeout;

    /**
     * Creates an instance of SDKConfig with the given parameters
     * @param {number} timeout A Integer representing timeout
     */
    constructor(timeout) {
        this._timeout = timeout;
    }

    /**
     *  This is a getter method to get timeout.
     * @returns {number} A Integer representing API timeout
     */
    getTimeout() {
        return this._timeout;
    }
}

module.exports = {
    MasterModel: SDKConfig,
    SDKConfig: SDKConfig
}
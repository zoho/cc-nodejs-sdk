const DataCenter = require("./data_center").DataCenter;

/**
 * This class represents the properties of Zoho in CN Domain.
 */
class CNDataCenter extends DataCenter {

    static _PRODUCTION;

    static CN = new CNDataCenter();

    /**
     * This method represents the Zoho Production environment in CN domain
     * @returns {Environment} An instance of Environment
     */
    static PRODUCTION() {
        if (this._PRODUCTION == null) {
            this._PRODUCTION = DataCenter.setEnvironment("https://crm.zohopublic.com.cn", this.CN.getIAMUrl(), this.CN.getFileUploadUrl(), "cn_prd");
        }

        return this._PRODUCTION;
    }

    getIAMUrl() {
        return "https://accounts.zoho.com.cn/oauth/v2/token";
    }

    getFileUploadUrl() {
        return "https://content.zohoapis.com.cn"
    }
}

module.exports = {
    MasterModel: CNDataCenter,
    CNDataCenter: CNDataCenter
}

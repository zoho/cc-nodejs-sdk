const DataCenter = require("./data_center").DataCenter;

/**
 * This class represents the properties of Zoho in AU Domain.
 * @extends DataCenter
 */
class AUDataCenter extends DataCenter {

    static _PRODUCTION;

    static AU = new AUDataCenter();

    /**
     * This method represents the Zoho Production environment in AU domain
     * @returns {Environment} An instance of Environment
     */
    static PRODUCTION() {

        if (this._PRODUCTION == null) {
            this._PRODUCTION = DataCenter.setEnvironment("https://crm.zohopublic.com.au", this.AU.getIAMUrl(), this.AU.getFileUploadUrl(), "au_prd");
        }

        return this._PRODUCTION;
    }

    getIAMUrl() {
        return "https://accounts.zoho.com.au/oauth/v2/token";
    }

    getFileUploadUrl() {
        return "https://content.zohoapis.com.au"
    }
}

module.exports = {
    MasterModel: AUDataCenter,
    AUDataCenter: AUDataCenter
}

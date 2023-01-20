const DataCenter = require("./data_center").DataCenter;

/**
 * This class represents the properties of Zoho in US Domain.
 */
class USDataCenter extends DataCenter {

	static _PRODUCTION;

	static US = new USDataCenter();

	/**
	 * This method represents the Zoho Production environment in US domain
	 * @returns {Environment} An instance of Environment
	 */
	static PRODUCTION() {
		if (this._PRODUCTION == null) {
			this._PRODUCTION = DataCenter.setEnvironment("https://crm.zohopublic.com", this.US.getIAMUrl(), this.US.getFileUploadUrl(), "us_prd");
		}

		return this._PRODUCTION;
	}

	getIAMUrl() {
		return "https://accounts.zoho.com/oauth/v2/token";
	}

	getFileUploadUrl() {
		return "https://content.zohoapis.com"
	}
}

module.exports = {
	MasterModel: USDataCenter,
	USDataCenter: USDataCenter
}

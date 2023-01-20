const DataCenter = require("./data_center").DataCenter;

/**
 * This class represents the properties of Zoho in EU Domain.
 * @extends DataCenter
 */
class EUDataCenter extends DataCenter {

	static _PRODUCTION;

	static EU = new EUDataCenter();

	/**
	 * This method represents the Zoho Production environment in EU domain
	 * @returns {Environment} An instance of Environment
	 */
	static PRODUCTION() {
		if (this._PRODUCTION == null) {
			this._PRODUCTION = DataCenter.setEnvironment("https://crm.zohopublic.eu", this.EU.getIAMUrl(), this.EU.getFileUploadUrl(), "eu_prd");
		}

		return this._PRODUCTION;
	};

	getIAMUrl() {
		return "https://accounts.zoho.eu/oauth/v2/token";
	}

	getFileUploadUrl() {
		return "https://content.zohoapis.eu"
	}
}

module.exports = {
	MasterModel: EUDataCenter,
	EUDataCenter: EUDataCenter
}

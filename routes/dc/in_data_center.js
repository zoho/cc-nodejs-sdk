const DataCenter = require("./data_center").DataCenter;

/**
 * This class represents the properties of Zoho in IN Domain.
 * @extends DataCenter
 */
class INDataCenter extends DataCenter {

	static _PRODUCTION;

	static IN = new INDataCenter();

	/**
	 * This method represents the Zoho Production environment in IN domain
	 * @returns {Environment} An instance of Environment
	 */
	static PRODUCTION() {
		if (this._PRODUCTION == null) {
			this._PRODUCTION = DataCenter.setEnvironment("https://crm.zohopublic.in", this.IN.getIAMUrl(), this.IN.getFileUploadUrl(), "in_prd");
		}

		return this._PRODUCTION;
	};

	getIAMUrl() {
		return "https://accounts.zoho.in/oauth/v2/token";
	}

	getFileUploadUrl() {
		return "https://content.zohoapis.in"
	}
}

module.exports = {
	MasterModel: INDataCenter,
	INDataCenter: INDataCenter
}

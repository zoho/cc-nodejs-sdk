let Converter = require("./converter").Converter;
const Initializer = require("../../routes/initializer").Initializer;
const SDKException = require("../../routes/exception/sdk_exception").SDKException;
const DatatypeConverter = require("../util/datatype_converter").DatatypeConverter;
const path = require('path');
const Constants = require("./constants").Constants;

/**
 * This class processes the API response to the object and an object to a JSON object, containing the request body.
 */
class TEXTConverter extends Converter {
	uniqueValuesMap = {};

	constructor(commonAPIHandler) {
		super(commonAPIHandler);
	}

	async appendToRequest(requestBase, requestObject) {
		return null;
	}

	async formRequest(requestInstance, pack, instanceNumber, memberDetail) {

		return null;
	}

	async getWrappedResponse(response, pack) {
		if (response.body.length != 0) {

			return await this.getResponse(response.body, pack);
		}

		return null;
	}

	async getResponse(responseJSON, packageName) {

		var instance = null;

		if (responseJSON == null || responseJSON == "" || responseJSON.length == 0) {
			return instance;
		}

		var classDetail = Initializer.jsonDetails[packageName];

		let ClassName = require("../../" + packageName).MasterModel;

		instance = new ClassName();

        for (let memberName in classDetail) {
			Reflect.set(instance, memberName, responseJSON);
		}

		return instance;
	}
}

module.exports = {
	MasterModel: TEXTConverter,
	TEXTConverter: TEXTConverter
}
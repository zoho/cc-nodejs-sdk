const Constants = require("./constants").Constants;
const SDKException = require("../../routes/exception/sdk_exception").SDKException;
const Initializer = require("../../routes/initializer").Initializer;

/**
 * This class is to construct API request and response.
 */
class Converter {
	commonAPIHandler;

	/**
	 * Creates a Converter class instance with the CommonAPIHandler class instance.
	 * @param {CommonAPIHandler} commonAPIHandler - A CommonAPIHandler class instance.
	 */
	constructor(commonAPIHandler) {
		this.commonAPIHandler = commonAPIHandler;
	}

	/**
	 * This abstract method is to process the API response.
	 * @param {object} response - An Object containing the API response contents or response.
	 * @param {string} pack - A String containing the expected method return type.
	 * @returns An Object representing the class instance.
	 * @throws {Error}
	 */
	getResponse(response, pack) { }

	/**
	 * This method is to construct the API request.
	 * @param {object} requestObject - An Object containing the class instance.
	 * @param {string} pack - A String containing the expected method return type.
	 * @param {int} instanceNumber - An Integer containing the class instance list number.
	 * @param {object} memberDetail - An object containing the member properties
	 * @returns An Object representing the API request body object.
	 * @throws {Error}
	 */
	formRequest(responseObject, pack, instanceNumber, memberDetail) { }

	/**
	 * This abstract method is to construct the API request body.
	 * @param {object} requestBase
	 * @param {object} requestObject - A Object containing the API request body object.
	 * @throws {Error}
	 */
	appendToRequest(requestBase, requestObject) { }

	/**
	 * This abstract method is to process the API response.
	 * @param {object} response - An Object containing the HttpResponse class instance.
	 * @param {string} pack - A String containing the expected method return type.
	 * @returns An Object representing the class instance.
	 * @throws {Error}
	 */
	getWrappedResponse(response, pack) { }
}

module.exports = {
	MasterModel: Converter,
	Converter: Converter
}
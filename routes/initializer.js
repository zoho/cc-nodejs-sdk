const SDKException = require('../routes/exception/sdk_exception').SDKException;
const Environment = require("../routes/dc/environment").Environment;
const Logger = require('winston');
const Constants = require('../utils/util/constants').Constants;
const RequestProxy = require("./request_proxy").RequestProxy;
const path = require("path");
const loggerFile = require('./logger/logger');
const SDKLogger = require('./logger/sdk_logger').SDKLogger;
const SDKConfig = require('./sdk_config').SDKConfig;

/**
 * The class to initialize Zoho SDK.
 */
class Initializer {
	static LOCAL = new Map();

	static initializer;

	_environment;

	static jsonDetails;

	_requestProxy;

	_sdkConfig;

	/**
	 * The method is to initialize the SDK.
	 * @param {Environment} environment - A Environment class instance containing the Zoho API base URL and Accounts URL.
	 * @param {SDKConfig} sdkConfig - A SDKConfig class instance containing the configuration.
	 * @param {loggerFile.Logger} logger - A Logger class instance containing the log file path and Logger type.
	 * @param {RequestProxy} proxy - A RequestProxy class instance containing the proxy properties of the user.
	 * @throws {SDKException}
	 */
	static async initialize(environment, sdkConfig, logger = null, proxy = null) {
		try {
			SDKLogger.initialize(logger);

			try {
				if (Initializer.jsonDetails == null) {
					Initializer.jsonDetails = Initializer.getJSON(path.join(__dirname, "..", Constants.CONFIG_DIRECTORY, Constants.JSON_DETAILS_FILE_PATH));
				}
			}
			catch (ex) {
				throw new SDKException(Constants.JSON_DETAILS_ERROR, null, null, ex);
			}

			let initializer = new Initializer();

			initializer._environment = environment;

			initializer._sdkConfig = sdkConfig;

			initializer._requestProxy = proxy;

			Initializer.LOCAL.set(await initializer.getEncodedKey(environment), initializer);

			Initializer.initializer = initializer;

		} catch (err) {
			if (!(err instanceof SDKException)) {
				err = new SDKException(Constants.INITIALIZATION_EXCEPTION, null, null, err);
			}

			throw err;
		}
	}

	/**
	 * This method to get record field and class details.
	 * @param filePath A String containing the file path.
	 * @returns A JSON representing the class information details.
	 */
	static getJSON(filePath) {
		let fs = require('fs');

		let fileData = fs.readFileSync(filePath);

		return JSON.parse(fileData);
	}

	/**
	 * This method is to get Initializer class instance.
	 * @returns A Initializer class instance representing the SDK configuration details.
	 */
	static async getInitializer() {
		if (Array.from(Initializer.LOCAL.keys()).length > 0) {
			let initializer = new Initializer();

			let encodedKey = await initializer.getEncodedKey(Initializer.initializer._environment);

			if (Initializer.LOCAL.has(encodedKey)) {
				return Initializer.LOCAL.get(encodedKey);
			}
		}

		return Initializer.initializer;
	}

	/**
	 * This method is to switch the different user in SDK environment.
	 * @param {Environment} environment - A Environment class instance containing the Zoho API base URL and Accounts URL.
	 * @param {SDKConfig} sdkConfig - A SDKConfig instance representing the configuration
	 * @param {RequestProxy} proxy - A RequestProxy class instance containing the proxy properties.
	 */
	static async switchUser(environment, sdkConfig, proxy = null) {
		let initializer = new Initializer();

		initializer._environment = environment;

		initializer._sdkConfig = sdkConfig;

		initializer._requestProxy = proxy;

		Initializer.LOCAL.set(await initializer.getEncodedKey(environment), initializer);

		Initializer.initializer = initializer;
	}

	/**
	 * This is a getter method to get API environment.
	 * @returns A Environment representing the API environment.
	 */
	getEnvironment() {
		return this._environment;
	}

	/**
	 * This is a getter method to get Proxy information.
	 * @returns {RequestProxy} A RequestProxy class instance representing the API Proxy information.
	 */
	getRequestProxy() {
		return this._requestProxy;
	}

	/**
	 * This is a getter method to get the SDK Configuration
	 * @returns {SDKConfig} A SDKConfig instance representing the configuration
	 */
	getSDKConfig() {
		return this._sdkConfig;
	}

	static async removeUserConfiguration(user, environment) {
		let initializer = new Initializer();

		let encodedKey = await initializer.getEncodedKey(environment);

		if (Initializer.LOCAL.has(encodedKey)) {
			Initializer.LOCAL.delete(encodedKey);
		}
		else {
			throw new SDKException("Environment not found", Constants.USER_NOT_FOUND_ERROR);
		}
	}

	async getEncodedKey(environment) {
		let key = environment.getUrl();

		return Buffer.from(this.toUTF8Array(key)).toString('base64');
	}

	toUTF8Array(str) {
		var utf8 = [];

		for (var i = 0; i < str.length; i++) {
			var charcode = str.charCodeAt(i);

			if (charcode < 0x80) utf8.push(charcode);
			else if (charcode < 0x800) {
				utf8.push(0xc0 | (charcode >> 6),
					0x80 | (charcode & 0x3f));
			}
			else if (charcode < 0xd800 || charcode >= 0xe000) {
				utf8.push(0xe0 | (charcode >> 12),
					0x80 | ((charcode >> 6) & 0x3f),
					0x80 | (charcode & 0x3f));
			}
			else {
				i++;
				// UTF-16 encodes 0x10000-0x10FFFF by
				// subtracting 0x10000 and splitting the
				// 20 bits of 0x0-0xFFFFF into two halves
				charcode = 0x10000 + (((charcode & 0x3ff) << 10)
					| (str.charCodeAt(i) & 0x3ff));

				utf8.push(0xf0 | (charcode >> 18),
					0x80 | ((charcode >> 12) & 0x3f),
					0x80 | ((charcode >> 6) & 0x3f),
					0x80 | (charcode & 0x3f));
			}
		}
		return utf8;
	}
}

module.exports = {
	MasterModel: Initializer,
	Initializer: Initializer
}
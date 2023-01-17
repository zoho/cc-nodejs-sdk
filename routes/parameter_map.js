const HeaderParamValidator = require("../utils/util/header_param_validator").HeaderParamValidator;
const SDKException = require('../routes/exception/sdk_exception').SDKException;
const Constants = require("../utils/util/constants").Constants;

/**
 * This class represents the HTTP parameter name and value.
 */
class ParameterMap {

	parameterMap = new Map();

	/**
	 * This is a getter method to get parameter map.
	 * @returns {Map} A Map representing the API request parameters.
	 */
	getParameterMap() {
		return this.parameterMap;
	}

	/**
	 * The method to add parameter name and value.
	 * @param {Param} param - A Param class instance.
	 * @param {object} value - An object containing the parameter value.
	 * @throws {SDKException}
	 */
	async add(param, value) {

		if (param == null) {
			throw new SDKException(Constants.PARAMETER_NULL_ERROR, Constants.PARAM_INSTANCE_NULL_ERROR);
		}

		var paramName = param.getName();

		if (paramName == null) {
			throw new SDKException(Constants.PARAM_NAME_NULL_ERROR, Constants.PARAM_NAME_NULL_ERROR_MESSAGE);
		}else {
			const specialChars = /[`!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/;
            if(specialChars.test(paramName)) {
				throw new SDKException(Constants.INVALID_PARAM, "Only Alphabets, Numbers and Underscore( _ ) are allowed for Param :: "+ paramName);
			}
		}

		if (value == null) {
			throw new SDKException(Constants.PARAMETER_NULL_ERROR, paramName + Constants.NULL_VALUE_ERROR_MESSAGE);
		} else if(!(Object.prototype.toString.call(value) == "[object Number]") && !(Object.prototype.toString.call(value) == "[object String]") && !(Object.prototype.toString.call(value) == "[object Boolean]") && !(Object.prototype.toString.call(value) == "[object Date]")) {
		 	throw new SDKException(Constants.INVALID_DATA_TYPE, paramName + ", Please use the proper datatypes");
		}

		var paramClassName = param.getClassName();

		if(paramClassName == null) {
            throw new SDKException(Constants.INVALID_CLASS_NAME, "ClassName should not be null");
        }

		var parsedParamValue = value;

		if (paramClassName != null) {
			let headerParamValidator = new HeaderParamValidator();

			parsedParamValue = await headerParamValidator.validate(param, value);
		}

		if(parsedParamValue != null && parsedParamValue.toString().indexOf("::") !== -1) {
			throw new SDKException(Constants.RESERVE_KEYWORD_USAGE_ERROR, "Don't use this reserve keyword - ::");
		}

		const paramStr = paramName.toString();
		if(paramStr.toLowerCase() !== "digestkey" && paramStr.toLowerCase() !== "processname" && paramStr.toLowerCase() !== "statename" && paramStr.toLowerCase() !== "digest" && paramStr.toLowerCase() !== "identifier1" && paramStr.toLowerCase() !== "identifier2" && paramStr.toLowerCase() !== "identifier3" && paramStr.toLowerCase() !== "identifier4" && paramStr.toLowerCase() !== "identifier5") {
			parsedParamValue = parsedParamValue + "::" + paramClassName;
		}

		if (this.parameterMap.has(paramName)) {
			throw new SDKException(Constants.PARAMETER_DUPLICATE_ERROR, "Please Don't use duplicate params");
		} else {
			this.parameterMap.set(paramName, parsedParamValue.toString());
		}
	}
}

module.exports = {
	MasterModel: ParameterMap,
	ParameterMap: ParameterMap
}

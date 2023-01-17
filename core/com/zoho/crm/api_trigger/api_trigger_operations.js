const ParameterMap = require("../../../../../routes/parameter_map").MasterModel;
const APIResponse = require("../../../../../routes/controllers/api_response").MasterModel;
const CommonAPIHandler = require("../../../../../routes/middlewares/common_api_handler").MasterModel;
const Constants = require("../../../../../utils/util/constants").MasterModel;
const SDKException = require("../../../../../routes/exception/sdk_exception").MasterModel;
const Param = require("../../../../../routes/param").MasterModel;
class ApiTriggerOperations{
	/**
	 * The method to get api trigger with param
	 * @param {ParameterMap} paramInstance An instance of ParameterMap
	 * @returns {APIResponse} An instance of APIResponse
	 * @throws {SDKException}
	 */
	async getAPITriggerWithParam(paramInstance=null)	{
		if((paramInstance != null) && (!(paramInstance instanceof ParameterMap)))	{
			throw new SDKException(Constants.DATA_TYPE_ERROR, "KEY: paramInstance EXPECTED TYPE: ParameterMap", null, null);
		}
		var keyword = null;
		var processNameCount = 0, stateNameCount = 0, zgIdCount = 0, identifier1Count = 0, identifier2Count = 0, identifier3Count = 0, identifier4Count = 0, identifier5Count = 0, otherParamCount = 0;
		var isLengthExceeded = false, isDigestUsed = false;
		for (let key of paramInstance.getParameterMap().keys()) {
			keyword = key.toLowerCase();
			switch(keyword) {
			case "processname":
				processNameCount = processNameCount + 1;
				break;
			case "statename":
				stateNameCount = stateNameCount + 1;
				break;
			case "digestkey":
				zgIdCount = zgIdCount + 1;
				break;
			case "identifier1":
				identifier1Count = identifier1Count + 1;
				break;
			case "identifier2":
				identifier2Count = identifier2Count + 1;
				break;
			case "identifier3":
				identifier3Count = identifier3Count + 1;
				break;
			case "identifier4":
				identifier4Count = identifier4Count + 1;
				break;
			case "identifier5":
				identifier5Count = identifier5Count + 1;
				break;
			case "digest":
				isDigestUsed = true;
				break;
			default:
				otherParamCount = otherParamCount + 1;
				break;
			}
			let value = paramInstance.getParameterMap().get(key);
			if(keyword.length >= 255 || value.length >= 255) {
				isLengthExceeded = true;
			}
		}
		if(processNameCount == 0 || stateNameCount == 0 || zgIdCount == 0) {
			throw new SDKException(Constants.MANDATORY_NOT_FOUND, Constants.MANDATORY_KEY_ERROR);
		}else if (identifier1Count == 0 && identifier2Count == 0 && identifier3Count == 0 && identifier4Count == 0 && identifier5Count == 0) {
			throw new SDKException(Constants.MANDATORY_NOT_FOUND, "Please give atleast one identifier");
		}else if(processNameCount >= 2 || stateNameCount >= 2 || zgIdCount >= 2 || identifier1Count >= 2 || identifier2Count >= 2 || identifier3Count >= 2 || identifier4Count >= 2 || identifier5Count >= 2) {
			throw new SDKException(Constants.PARAMETER_DUPLICATE_ERROR, "Please Don't use duplicate params");
		}else if (otherParamCount > 2) {
			throw new SDKException(Constants.PARAM_LIMIT_EXCEED_ERROR, "Params limit exceeded. Please don't give more than 2 params");
		}else if(isDigestUsed) {
			throw new SDKException(Constants.RESERVE_KEYWORD_USAGE_ERROR, "Please don't use the reserve keyword digest");
		}else if(isLengthExceeded) {
			throw new SDKException(Constants.PARAM_LENGTH_EXCEED_ERROR, "The param length should not exceed the size 255");
		}
		var handlerInstance = new CommonAPIHandler();
		var apiPath = '';
		apiPath = apiPath.concat("/commandcenter");
		handlerInstance.setAPIPath(apiPath);
		handlerInstance.setHttpMethod(Constants.REQUEST_METHOD_GET);
		handlerInstance.setCategoryMethod(Constants.REQUEST_CATEGORY_READ);
		handlerInstance.setParam(paramInstance);
		let APIGET = require.resolve("./apiget");
		return handlerInstance.apiCall(APIGET, "text/plain");

	}

}
class GetAPITriggerParam{

//	static DIGEST = new Param("digest", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static PROCESSNAME = new Param("processName", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static STATENAME = new Param("stateName", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static DIGESTKEY = new Param("digestkey", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static IDENTIFIER1 = new Param("identifier1", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static IDENTIFIER2 = new Param("identifier2", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static IDENTIFIER3 = new Param("identifier3", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static IDENTIFIER4 = new Param("identifier4", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
	static IDENTIFIER5 = new Param("identifier5", "com.zoho.crm.ApiTrigger.GetAPITriggerParam");
}

class GetAPITriggerwithParamParam{

	static CUSTOM = new Param("custom", "com.zoho.crm.ApiTrigger.GetAPITriggerwithParamParam");
}

module.exports = {
	MasterModel : ApiTriggerOperations,
	ApiTriggerOperations : ApiTriggerOperations,
	GetAPITriggerwithParamParam : GetAPITriggerwithParamParam,
	GetAPITriggerParam : GetAPITriggerParam
}

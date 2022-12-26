const path = require("path");
const Constants = require("./constants").Constants;
const SDKException = require("../../routes/exception/sdk_exception").SDKException;
const DataTypeConverter = require("./datatype_converter").DatatypeConverter;
/**
 * This class validates the Header and Parameter values with the type accepted by the Zoho APIs.
 */
class HeaderParamValidator {
    async validate(headerParam, value) {
        let name = headerParam.getName();

        let className = headerParam.getClassName();

        if(className != null && className === "") {
            throw new SDKException(Constants.EMPTY_CLASS_ERROR, "Please give the proper className");
        } else if(className != null && className.toLowerCase() === "boolean") {
            value = DataTypeConverter.postConvert(value, "Boolean");
        } else if(className != null && className.toLowerCase() === "string") {
            value = DataTypeConverter.postConvert(value, "String");
        } else if(className != null && className.toLowerCase() === "date" ) {
            value = DataTypeConverter.postConvert(value, "Date");
        } else if(className != null && className.toLowerCase() === "datetime") {
            value = DataTypeConverter.postConvert(value, "DateTime");
        } else if(className != null && (className.toLowerCase() === "number" || className.toLowerCase() === "integer")) {
            value = DataTypeConverter.postConvert(value, "Number");
        } else if (className != null && className.indexOf("GetAPITriggerParam") !== -1) {
            let jsonDetails = await this.getJSONDetails();

            let jsonClassName = await this.getFileName(className);

            let typeDetail = null;

            if (jsonDetails.hasOwnProperty(jsonClassName)) {
                typeDetail = await this.getKeyJSONDetails(name, jsonDetails[jsonClassName]);
            }

            if (typeDetail != null) {
                if (!await this.checkDataType(typeDetail, value)) {
                    let type = jsonClassName != null && jsonClassName.endsWith("param") ? "PARAMETER" : "HEADER";

                    let detailsJO = {};

                    detailsJO[type] = name;

                    detailsJO[Constants.CLASS_KEY] = className;

                    detailsJO[Constants.ERROR_HASH_EXPECTED_TYPE] = Constants.SPECIAL_TYPES.has(typeDetail[Constants.TYPE]) ? Constants.SPECIAL_TYPES.get(typeDetail[Constants.TYPE]) : typeDetail[Constants.TYPE];

                    throw new SDKException(Constants.TYPE_ERROR, null, detailsJO, null);
                }
                else {
                    value = DataTypeConverter.postConvert(value, typeDetail[Constants.TYPE]);
                }
            }
        } else {
            throw new SDKException(Constants.INVALID_CLASS_NAME, "Please give the proper className");
        }

        return value;
    }

    async getJSONDetails() {
        let Initializer = require("../../routes/initializer").Initializer;

        if (Initializer.jsonDetails == null) {
            Initializer.jsonDetails = await Initializer.getJSON(path.join(__dirname, "..", "..", Constants.CONFIG_DIRECTORY, Constants.JSON_DETAILS_FILE_PATH));
        }

        return Initializer.jsonDetails;
    }

    async getFileName(name) {
        let spl = name.toString().split(".");
        let className = await this.getSplitFileName(spl.pop());
        let resourceName = await this.getSplitFileName(spl.pop());
        return "core/" + spl.join("/").toLowerCase() + "/" + resourceName.join("_") + "/" + className.join("_");
    }

    async getSplitFileName(className) {
        let fileName = []
        let nameParts = className.split(/([A-Z][a-z]+)/).filter(function (e) { return e });

        fileName.push(nameParts[0].toLowerCase());

        for (let i = 1; i < nameParts.length; i++) {
            fileName.push(nameParts[i].toLowerCase());
        }
    
        return fileName;
    }

    async getKeyJSONDetails(name, jsonDetails) {
        let keyArray = Array.from(Object.keys(jsonDetails));
        for (let index = 0; index < keyArray.length; index++) {
            const key = keyArray[index];

            let detail = jsonDetails[key];

            if (detail.hasOwnProperty(Constants.NAME) && detail[Constants.NAME].toLowerCase() == name.toLowerCase()) {
                return detail;
            }
        }
    }

    async checkDataType(keyDetail, value) {
        let type = keyDetail[Constants.TYPE];

        let dataType = Constants.SPECIAL_TYPES.has(type) ? Constants.SPECIAL_TYPES.get(type) : type;

        if (Constants.TYPE_VS_DATATYPE.has(dataType.toLowerCase())) {
            if (type == Constants.INTEGER_NAMESPACE) {
                return HeaderParamValidator.checkInteger(value);
            }
            if (Object.prototype.toString.call(value) != Constants.TYPE_VS_DATATYPE.get(type.toLowerCase())) {
                return false;
            }
        }

        return true;
    }

    static checkInteger(value) {
        return (parseInt(value) === value) ? true : false;
    }
}

module.exports = {
    MasterModel: HeaderParamValidator,
    HeaderParamValidator: HeaderParamValidator
}
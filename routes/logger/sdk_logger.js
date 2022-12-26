const { Levels } = require('./logger');

/**
 * The class to initialize the SDK logger.
 */
class SDKLogger {

    constructor(loggerInstance) {
        var winston = require('winston');

        winston.configure({
            level: loggerInstance != null ? loggerInstance.level : Levels.INFO,

            format: winston.format.combine(
                winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
                winston.format.prettyPrint()
            ),

            transports: [
                loggerInstance != null ? new winston.transports.File({filename:loggerInstance.getFilePath()}) : new winston.transports.Console()
            ]
        });
    }
    /**
     * The method to initialize SDKLogger
     * @param {Logger} logInstance A Logger class instance
     */
    static initialize(loggerInstance) {
        return new SDKLogger(loggerInstance);
    }
}

module.exports = {
    MasterModel: SDKLogger,
    SDKLogger: SDKLogger
};
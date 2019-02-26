const appRoot = require('app-root-path');
const winston = require('winston');



const customColors = {
    trace: 'white',
    debug: 'green',
    info: 'green',
    warn: 'yellow',
    crit: 'red',
    fatal: 'red'
};

const options = {
    file: {
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json()
        ),
        colors: customColors,
        levels: {
            trace: 0,
            debug: 1,
            info: 2,
            warn: 3,
            crit: 4,
            fatal: 5},
            filename: `${appRoot}/logs/app.log`,
            handleExceptions: true,
            json: true,
            maxsize: 5242880, // 5MB
            maxFiles: 5,
            colorize: false,
    },
    console: {
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.json(),
            winston.format.timestamp(),
            winston.format.prettyPrint()
        ),
        levels: {
            colors: customColors,
            trace: 0,
            debug: 1,
            info: 2,
            warn: 3,
            crit: 4,
            fatal: 5
        },
            handleExceptions: true,
            json: false,
            colorize: true,
        },
};

winston.addColors(customColors);

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on unhandled exceptions
});

logger.stream = {
    write: function(message, encoding) {
        logger.info(message);
    },
};

module.exports = logger;
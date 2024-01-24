const winston = require("winston")


const capitalizeLevel = winston.format((info, opts) => {
    console.log(typeof info.level)
    info.message = info.message.toUpperCase()
    return info;
});



const logger = winston.createLogger({
    level: "debug",
    format: winston.format.combine(
        winston.format.json(),
        winston.format.timestamp({
            format: "MMM-DD-YYYY HH:mm:ss",
        }),
    ),
    transports: [
        new winston.transports.Console({
            format: winston.format.combine(
                winston.format.colorize(),
                // winston.format.json(),
                winston.format.label({
                    label: "Production logger"
                }),

                winston.format.printf(({ level, label, timestamp, message, ...meta }) => {
                    return `${level} [${label}]: ${[timestamp]}: ${JSON.stringify(message)}${Object.keys(meta).length > 0 ? " : " + JSON.stringify(meta) : ""}`
                }
                ),
                // winston.format.simple()
            )
        }),
        new winston.transports.File({
            format: winston.format.combine(
                winston.format.label({
                    label: "Production logger"
                }),
                winston.format.timestamp({
                    format: "MMM-DD-YYYY HH:mm:ss",
                }),
                winston.format.json(),
            ),
            level: "error",
            filename: "logs/error.log",
        })
    ],
});

module.exports = logger
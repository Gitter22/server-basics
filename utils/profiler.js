
const winston = require("winston")

const onlyProfile = winston.format((info, opts) => {
    const { level, message, ...rest } = info
    if (!rest.durationMs) return false
    return info;
});

const profiler = winston.createLogger({
    format: winston.format.combine(
        onlyProfile(),
        winston.format.label({
            label: "Profiler"
        }),
        winston.format.json()
    ),
    transports: [
        new winston.transports.File({
            filename: 'logs/profile.log'
        })
    ]
})

module.exports = profiler
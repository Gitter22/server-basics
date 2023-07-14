const createHttpError = require('http-errors')
const Joi = require('joi')
const logger = require('../utils/logger')

let joiValidateOptions = {
    errors: {
        wrap: {
            label: false
        }
    },
    abortEarly: false
}

const validator = (schema, property) => {
    return (req, res, next) => {
        const { error } = schema.validate(req[property], joiValidateOptions)
        logger.debug(error)
        console.log(error)
        const valid = error === undefined
        if (valid) {
            return next()
        } else {
            const message = error.details.map(d => d.message).join(',')
            return next(new createHttpError.BadRequest(message))
        }
    }
}

module.exports = validator
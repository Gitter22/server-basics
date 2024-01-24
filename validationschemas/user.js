const Joi = require('joi')

module.exports = {
    registerSchema: Joi.object().keys({
        username: Joi.string().min(3).max(20).alphanum().required(),
        password: Joi.string().min(8).required(),
        firstname: Joi.string().required(),
        lastname: Joi.string().required(),
        addresses: Joi.array().required(),
    })
}

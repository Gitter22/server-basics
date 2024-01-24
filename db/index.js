const mongoose = require('mongoose')

const logger = require('../utils/logger')

const config = require('../config')

mongoose.set('strict', true)
mongoose.set('strictQuery', false)


const connection = mongoose.createConnection(config.mongoConnectionURL)


connection.on('error', (err) => logger.error(err))
connection.on('connected', () => logger.info("db connection successfull", { success: 'Yeah!' }))


module.exports = connection
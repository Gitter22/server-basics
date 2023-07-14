const dotenv = require('dotenv')

dotenv.config()

const config = {
    env: process.env.NODE_ENV,
    mongoConnectionURL: process.env.MONGODB_CONNECTION_URL,
}


module.exports = config
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')
const createHttpError = require('http-errors')


const authguard = (req, res, next) => {
    if (req.headers['authorization']) {
        const authHeader = req.headers['authorization']
        const [scheme, token] = authHeader.split(' ')
        if (scheme !== 'Bearer') {
            return next(createHttpError.Unauthorized('You are unauthorized to access this route'))
        }
        jwt.verify(token, 'secret', function (err, payload) {
            if (err) {
                return next(createHttpError.Unauthorized('You are unauthorized to access this route'))
            }
            req.userId = payload.subject
        })
        next()
    } else {
        res.status(401).send("You are unauthorized to access this route")
    }
}

module.exports = authguard
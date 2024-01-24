const User = require('../models/user')
const createError = require('http-errors')
const bcrypt = require('bcrypt');
const logger = require('../utils/logger')
const profiler = require('../utils/profiler')
const jwt = require('jsonwebtoken')
const eventEmitter = require('../eventEmitter')


module.exports = {
    async register(req, res, next) {
        console.time('register route')
        const { username, password, firstname, lastname, addresses } = req.body
        const foundUser = await User.findOne({ username })

        if (foundUser) {
            return next(new createError.BadRequest('Username already exists'))
        } else {
            const saltRounds = 10
            const hash = await bcrypt.hash(password, saltRounds)

            const newUser = new User({ username, password: hash, firstname, lastname, addresses })
            delete newUser.password
            logger.debug("🚀 ~ file: auth.js:9 ~ register ~ newUser", newUser)
            await newUser.save()

            eventEmitter.emit('user:registered', newUser)

            res.status(201).send({ message: 'User Registered Successfully', data: newUser })
        }
        console.timeEnd('register route')
    },

    async login(req, res, next) {
        profiler.profile('login')
        const { username, password } = req.body
        const foundUser = await User.findOne({ username }, '+password')
        console.log("🚀 ~ file: auth.js:34 ~ login ~ foundUser:", foundUser)
        if (!foundUser) {
            return next(new createError.Unauthorized('Username or password incorrect'))
        } else {
            console.log("🚀 ~ file: auth.js:33 ~ login ~ username:", username)
            console.log("🚀 ~ file: auth.js:33 ~ login ~ password:", password)
            const arePasswordsEqual = await bcrypt.compare(password, foundUser.password)
            console.log("🚀 ~ file: auteyJleHBpcmVzSW4iOjM2MDAsInN1YmplY3QiOiI2NDEyYjkyMWQ2MWU4ZTYzNDVjNWNhN2YiLCJpc3N1ZXIiOiJNeSBTZXJ2ZXIiLCJpYXQiOjE2Nzg5NTYzMDV9h.js:40 ~ login ~ arePasswordsEqual:", arePasswordsEqual)
            if (!arePasswordsEqual) {
                return next(new createError.Unauthorized('Username or password incorrect'))
            } else {
                // res.status(200).send({ message: 'Login Successful', data: foundUser })

                const jwtpayload = {
                    expiresIn: 60 * 60,
                    subject: foundUser._id,
                    issuer: 'My Server'
                }
                jwt.sign(jwtpayload, 'secret', function (err, token) {
                    if (err) {
                        console.log(err)
                        logger.error(err)
                        next(new createError.InternalServerError(err))
                    } else {
                        logger.debug(token)
                        res.status(200).send({ message: 'Login Successful', data: token })
                    }
                })
            }
        }
        profiler.profile('login')
    },


    logout(req, res) {

    },

    resetPassword(req, res) {

    },
}

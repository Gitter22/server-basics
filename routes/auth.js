const express = require('express')

const AuthController = require('../controllers/auth')
const wrapAsnyc = require('../utils/wrapAsync')
const validator = require('../middlewares/validator')
const UserValidationSchema = require('../validationschemas/user')

const router = express.Router()
router.post('/register', validator(UserValidationSchema.registerSchema, 'body'), wrapAsnyc(AuthController.register))
router.post('/login', wrapAsnyc(AuthController.login))
router.post('/logout', wrapAsnyc(AuthController.logout))


module.exports = router
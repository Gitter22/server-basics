const express = require('express')
const router = express.Router({ mergeParams: true })
const UserController = require('../controllers/user')
const wrapAsync = require('../utils/wrapAsync')
const logger = require('../utils/logger')
const authGuard = require('../middlewares/authguard')

router.use((req, res, next) => {
    logger.debug("this is from the user routes middleware")
    next()
})

router.get('/', authGuard, wrapAsync(UserController.getUsers))

router.get('/:username', wrapAsync(UserController.getUserDetails))

router.post('/:userId/assignrestaurant', wrapAsync(UserController.assignRestaurant))


module.exports = router
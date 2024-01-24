const router = require('express').Router({ mergeParams: true })
const DeveloperController = require('../controllers/developer')
const wrapAsync = require('../utils/wrapAsync')


router.get('/profiles', wrapAsync(DeveloperController.getProfileData))

module.exports = router
const express = require('express')
const router = express.Router({ mergeParams: true })
const RestaurantController = require('../controllers/restaurant')
const wrapAsync = require('../utils/wrapAsync')


router.get('/', wrapAsync(RestaurantController.getAllRestaurants))
router.post('/', wrapAsync(RestaurantController.addSingleRestaurant))
router.post('/multiple', wrapAsync(RestaurantController.addMultipleRestaurant))
router.post('/:id/addtimings', wrapAsync(RestaurantController.addTimings))
router.post('/changetimings', wrapAsync(RestaurantController.changeTimings))
router.delete('/:id', wrapAsync(RestaurantController.deleteRestaurant))
router.post('/:id/assign-manager', wrapAsync(RestaurantController.assignManager))
router.post('/:id/change-manager', wrapAsync(RestaurantController.changeManager))




module.exports = router
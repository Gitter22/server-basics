const createHttpError = require('http-errors')
const Restaurant = require('../models/restaurants')
const User = require('../models/user')
const logger = require('../utils/logger')
const profiler = require('../utils/profiler')

module.exports = {
    async addSingleRestaurant(req, res, next) {
        console.time('addSingleRestaurant')
        const restaurantspayload = req.body
        const restaurant = new Restaurant(restaurantspayload)
        await restaurant.save()
        res.status(201).send({ message: 'Restaurant created Succesfully', data: restaurantspayload })
        console.timeEnd('addSingleRestaurant')
    },

    async addMultipleRestaurant(req, res, next) {
        console.time('addMultipleRestaurant')
        const restaurantspayload = req.body
        if (!Array.isArray(restaurantspayload)) {
            return next(new createHttpError.BadRequest('Body must be an array'))
        }
        const result = await Restaurant.insertMany(restaurantspayload, { rawResult: false })
        res.status(201).send({ message: 'Restaurant created Succesfully', data: result })
        console.timeEnd('addMultipleRestaurant')
    },

    async getAllRestaurants(req, res, next) {
        // logger.profile('getAllRestaurants')
        profiler.profile('getAllRestaurants')
        // console.time("getAllRestaurants")
        const totalRestaurantCount = await Restaurant.estimatedDocumentCount()
        const restaurants = await Restaurant.find({}, { title: 1, manager: 1 })
            .populate({
                path: 'manager',
                select: 'firstname',
                populate: {
                    path: 'assignedRestaurants',
                    select: 'title'
                }
            })
        res.status(200).send({ message: 'Success!', data: { results: restaurants, totalcount: totalRestaurantCount } })
        // console.timeEnd("getAllRestaurants")
        profiler.profile('getAllRestaurants')
        // logger.profile('getAllRestaurants')


    },

    async addTimings(req, res, next) {
        console.time("updateRestaurantTimings")
        const { id } = req.params
        const timings = req.body
        if (!timings || typeof timings !== 'object' || !Object.keys(timings).length > 0) {
            return next(new createHttpError.BadRequest('timings is not provided'))
        }
        const result = await Restaurant.findOneAndUpdate({ _id: id }, { $push: { timings: timings } }, { runValidators: true, rawResult: false })
        if (!result) {
            return next(new createHttpError.BadRequest('Update failed with provided params'))
        }
        res.status(200).send({ message: 'Success!', data: result })
        console.timeEnd("updateRestaurantTimings")
    },
    async changeTimings(req, res, next) {
        console.time("updateRestaurantTimings")
        const timings = req.body
        if (!timings || typeof timings !== 'object' || !Object.keys(timings).length > 0) {
            return next(new createHttpError.BadRequest('timings is not provided'))
        }
        const result = await Restaurant.updateMany({ timings: { $size: 1 } }, { timings: timings }, { runValidators: true, new: true })

        if (!result) {
            return next(new createHttpError.BadRequest('Update failed with provided params'))
        }
        res.status(200).send({ message: 'Success!', data: result })
        console.timeEnd("updateRestaurantTimings")
    },

    async deleteRestaurant(req, res, next) {
        console.time("deleteRestaurant")
        const { id } = req.params
        const updatedUsers = await User.updateMany({ assignedRestaurants: id }, { $pull: { assignedRestaurants: id } })
        const result = await Restaurant.findOneAndDelete({ _id: id }, { rawResult: false })
        // const result = await Restaurant.deleteMany({ description: /egg/ })
        if (!result) {
            return next(new createHttpError.BadRequest('Delete failed for provided restaurant id'))
        }
        res.status(200).send({ message: 'Success!', data: result })
        console.timeEnd("deleteRestaurant")
    },

    async assignManager(req, res, next) {
        console.time("assignManager")
        const { id } = req.params
        const userId = req.body.userId
        const updatedUser = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { assignedRestaurants: id } }, { new: true })
        logger.debug("🚀 ~ file: restaurant.js:81 ~ assignManager ~ updatedUser:", updatedUser)
        const result = await Restaurant.findOneAndUpdate({ _id: id }, { manager: userId }, { new: true })

        if (!result) {
            return next(new createHttpError.BadRequest('Assign Manager Failed with provided params'))
        }
        res.status(200).send({ message: 'Manager Assigned Successfully!', data: result })
        console.timeEnd("assignManager")
    },

    async changeManager(req, res, next) {
        console.time("changeManager")
        const { id } = req.params
        const userId = req.body.userId

        //remove it from the old user
        const oldManager = await User.findOneAndUpdate({ assignedRestaurants: id }, { $pull: { assignedRestaurants: id } }, { new: true })
        logger.debug("🚀 ~ file: restaurant.js:106 ~ changeManager ~ oldManager:", oldManager.firstname)

        //add it to the new user
        const newManager = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { assignedRestaurants: id } }, { new: true })
        logger.debug("🚀 ~ file: restaurant.js:110 ~ changeManager ~ newManager:", newManager.firstname)

        //change manager on the restaurant
        const result = await Restaurant.findOneAndUpdate({ _id: id }, { manager: userId }, {
            new: true, populate: {
                path: 'manager',
                select: { firstname: 1 }
            }
        })
        logger.debug("🚀 ~ file: restaurant.js:114 ~ changeManager ~ result:", result.manager)

        if (!result) {
            return next(new createHttpError.BadRequest('change Manager Failed with provided params'))
        }
        res.status(200).send({ message: 'Manager Assigned Successfully!', data: result })
        console.timeEnd("changeManager")
    }
}


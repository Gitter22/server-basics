const createHttpError = require("http-errors")
const User = require("../models/user")
const logger = require('../utils/logger')

module.exports = {
    async getUsers(req, res, next) {

        logger.debug(req.userId)
        console.time('getUsers')
        const users = await User.find({}, {
            createdAt: 0, updatedAt: 0,
            'addresses.createdAt': 0,
            'addresses.updatedAt': 0,
            // 'addresses.country': 0,
        })
            .populate({
                path: 'assignedRestaurants',
                select: { title: 1 }
            })

            .sort({ 'addresses.createdAt': -1 })
        res.status(200).send({ message: 'Success', data: users })
        console.timeEnd('getUsers')
    },

    async getUserDetails(req, res, next) {
        console.time('getUserDetails')
        const { username } = req.params
        const user = await User.findOne({ username })
        res.status(200).send({ message: 'User Details Fetched Successfully', data: user })
        console.timeEnd('getUserDetails')
    },

    async assignRestaurant(req, res, next) {
        console.time('assignRestaurant')
        const { userId } = req.params
        logger.debug("🚀 ~ file: user.js:30 ~ assignRestaurant ~ id:", userId)
        const restaurantId = req.body.restaurantId
        logger.debug("🚀 ~ file: user.js:28 ~ assignRestaurant ~ restaurantId:", restaurantId)
        const result = await User.findOneAndUpdate({ _id: userId }, { $addToSet: { assignedRestaurants: restaurantId } }, { new: true })
        if (!result) {
            return next(new createHttpError.BadRequest('Failed to assign restaurant with provided params'))
        }
        res.status(200).send({ message: 'Restaurant assigned to User Successfully', data: result })
        console.timeEnd('assignRestaurant')
    }
}
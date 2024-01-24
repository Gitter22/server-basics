const mongoose = require('mongoose');
const connection = require('../db');
const User = require('./user');


let timingSchema = new mongoose.Schema({
    openTime: {
        type: Number,
        required: true,
        min: 0,
        max: 60 * 24,
        get: function (v) {
            return `${Math.floor(v / 60)}:${v % 60}`
        },
        set: function (v) {
            const [hours, minutes] = v.split(':')
            try {
                return Number(hours) * 60 + Number(minutes)
            } catch {
                throw new Error('Time Format invalid')
            }
        }

    },
    closeTime: {
        type: Number,
        required: true,
        min: 0,
        max: 60 * 24,
        get: function (v) {
            return `${Math.floor(v / 60)}:${v % 60}`
        },
        set: function (v) {
            const [hours, minutes] = v.split(':')
            try {
                let a = Number(hours) * 60 + Number(minutes)
                return a
            } catch {
                throw new Error('Time Format invalid')
            }
        },
        validate: {
            validator: function (v) {
                try {
                    const [hours, minutes] = this.openTime.split(':')
                    let openTimeToNumber = Number(hours) * 60 + Number(minutes)
                    return openTimeToNumber < v
                } catch {
                    throw new Error('Time format invalid')
                }

            },
            message: 'Close time must be greater than Open time'
        }
    }
})


const RestaurantSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Restaurant name is required']
    },
    type: {
        type: String,
        enum: { values: ['quick service', 'dine-in', 'cloud'], message: "'{VALUE}' value is not supported" },
        required: true,
        default: 'dine-in'
    },
    cuisines: [String],
    description: {
        type: String,

    },
    ratings: {
        type: Number,
    },
    timings: [{
        type: timingSchema,
        default: "N/A"
    }],
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: User
    }
}, {
    timestamps: true
})

const Restaurant = connection.model('Restaurant', RestaurantSchema)

module.exports = Restaurant
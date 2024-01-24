const mongoose = require('mongoose');
const connection = require('../db')


let addressSchema = new mongoose.Schema({
    housenumber: {
        type: String,
        required: true,
        maxLength: [5, 'House Number is required!'],
    },
    street: {
        type: String,
        required: [true, 'Please provide street name!'],
        maxLength: [25, 'Street name is too long!'],
    },
    landmark: String,
    area: {
        type: String,
        required: [true, 'Please provide area/locality'],
        maxLength: [25, 'Area name is too long']
    },
    city: {
        type: String,
        required: [true, 'City is required'],
        maxLength: [15, 'City name is too long!'],
    },
    state: {
        type: String,
        required: [true, 'State is required'],
        maxLength: [20, 'State name is too long!']
    },
    country: {
        type: String,
        default: 'India',
        enum: { values: ['India', 'Canada'], message: '{VALUE} is not supported, default is India' },
        // get: (v) => `${v.substr(0, 2)}`
    }
}, {
    timestamps: true,
    toJSON: { getters: true },
    // toObject: { virtuals: true }
})
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        minLength: 3,
        maxLength: 25,
    },
    password: {
        type: String,
        select: false,
        required: true
    },

    firstname: {
        type: String,
        required: [true, 'First name is required!']
    },
    lastname: {
        type: String,
        required: [true, 'Last name is required!']
    },
    addresses: {
        type: [addressSchema],
        required: [true, "Atleast 1 address is required"],
        default: undefined,
        castNonArrays: false,
        // validate: {
        //     validator: function () {
        //         return this.addresses.length > 0
        //     },
        //     message: 'Atleast 1 address is required'
        // }
    },
    assignedRestaurants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Restaurant'
    }]
}, {
    timestamps: true
})

const User = connection.model('User', UserSchema)

module.exports = User
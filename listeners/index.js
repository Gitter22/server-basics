const eventEmitter = require('../eventEmitter')
const userRegisteredListener = require('./userRegistered')

const listeners = [userRegisteredListener]


module.exports = function registerEventListeners() {

    listeners.forEach(listener => {
        listener(eventEmitter)
    })
}
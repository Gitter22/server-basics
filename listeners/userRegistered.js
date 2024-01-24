
module.exports = function userRegisteredListener(eventEmitter) {

    eventEmitter.on('user:registered', (user) => {
        console.log("user is registered", user)
    })

}
const cron = require('node-cron')
const User = require('../models/user')
const process = require("process");
const fs = require("fs");
const os = require("os");

const everyMinute = '* * * * *'
const everyFiveSecs = '*/5 * * * * *'

function taskTodoEveryMinute() {
    console.log("just log every minute")
}

async function taskTodoEveryFiveSecs() {

    console.log("every 5 seconds")
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

    // console.log(users)
}


const taskA = cron.schedule(everyMinute, taskTodoEveryMinute, { scheduled: false })
const taskB = cron.schedule(everyFiveSecs, taskTodoEveryFiveSecs, { scheduled: false })

let cronTasks = [taskA, taskB]
module.exports = {
    startAll() {
        cronTasks.forEach(task => {
            task.start()
        })
        console.log("all tasks started")
    },
    stopAll() {
        cronTasks.forEach(task => {
            task.stop()
        })
        console.log("all tasks stopped")
    },
    start(taskname) {
        if (taskname === 'taskA') {
            console.log("task A started")
            taskA.start()
        } else if (taskname === 'taskB') {
            console.log("task B started")
            taskB.start()
        }
    },
    stop(taskname) {
        if (taskname === 'taskA') {
            taskA.stop()
            console.log("task A stopped")
        } else if (taskname === 'taskB') {
            console.log("task B stopped")
            taskB.stop()
        }
    }
}

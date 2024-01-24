const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const path = require('path')
const scheduledTasks = require('./tasks/tasks')
const registerEventListeners = require('./listeners')

const userRoutes = require('./routes/user')
const authRoutes = require('./routes/auth')
const restaurantRoutes = require('./routes/restaurant')
const developerRoutes = require('./routes/developer')
const uploadRoutes = require('./routes/upload')

const authguard = require('./middlewares/authguard')
const logger = require('./utils/logger')

const app = express()



const protectedRoutesMiddleware = [authguard]

//app-level-middlewares

//bodyParser.json is required to parse json payloads and populates req.body with json payload value
app.use(bodyParser.json())

//custom middlewares
app.use((req, res, next) => {
    // logger.info(`this middleware logs req.method, ${req.method}`, { method: req.method })
    next()
})
app.use((req, res, next) => {
    // logger.info(`this is middleware logs req.originalUrl${req.originalUrl}`)
    next()
})
// app.use((req, res, next) => {
//     logger.debug("this middleware logs time and may call error handler")
//     logger.debug(Date.now())
//     Math.random() < 0.5 ? next() : next("error from time logging middleware")
// })

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/auth', authRoutes)
app.use('/users', userRoutes)
app.use('/restaurants', restaurantRoutes)
app.use('/developer', developerRoutes)
app.use('/upload', uploadRoutes)

app.get('/files/:filename', (req, res, next) => {
    const filename = req.params.filename
    res.download(path.join(__dirname, `/uploads/${filename}`))
})

app.post('/start', (req, res, next) => {
    const name = req.query.name
    if (!name) {
        scheduledTasks.startAll()
    } else {
        scheduledTasks.start(name)
    }
    res.status(204).send('scheduled tasks started')
})

app.post('/stop', (req, res, next) => {
    const name = req.query.name
    if (!name) {
        scheduledTasks.stopAll()
    } else {
        scheduledTasks.stop(name)
    }
    res.status(200).send('scheduled tasks stopped')
})



app.get('/', (req, res) => {
    res.send("Hello from server")
})

app.get('/protected', protectedRoutesMiddleware, (req, res) => {
    res.send("Success from the proteced route")
})


//Register event Listeners
registerEventListeners()

//error-handlers
app.use((err, req, res, next) => {
    logger.error(err)
    return next(err)
})

//error-handlers
app.use((err, req, res, next) => {
    err.statusCode = err.statusCode || 500
    if (err.name === 'ValidationError') {
        err.statusCode = 400
    }
    res.status(err.statusCode).send({
        message: err.message,
        statusCode: err.statusCode
    })
})

//no route match middleware
app.use((req, res) => {
    logger.error("Error Handler", { hello: "no" })
    logger.error("from the no-route match middleware")
    res.status(404).send("No page exists!")
})



app.listen(3000, () => {
    logger.info("Server listening on port 3000")
    // scheduledTasks.startAll()
})

module.exports = app
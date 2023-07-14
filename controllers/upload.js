const logger = require('../utils/logger')
const profiler = require('../utils/profiler')
const app = require('../index')

module.exports = {
    async upload(req, res, next) {
        profiler.profile("upload")
        logger.debug(req.files)
        logger.debug(app.address)
        let urls = req.files.map(file => `${req.host}/${file.path}`)
        res.status(201).send({ message: 'File Uploaded Successfully', data: urls })
        profiler.profile("upload")
    },
}
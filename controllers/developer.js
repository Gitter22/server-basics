const logger = require('../utils/logger');
const profiler = require('../utils/profiler')

const options = {
    from: new Date() - (24 * 60 * 60 * 1000),
    until: new Date(),
    limit: 10,
    start: 0,
    order: 'desc',
    fields: ['message', 'durationMs']
};

//
// Find items logged between today and yesterday.
//


module.exports = {
    async getProfileData(req, res, next) {
        console.log(options)
        profiler.query(options, function (err, results) {
            if (err) {
                /* TODO: handle me */
                throw err;
            }
            console.log(results)
            res.status(200).send(results)
        })
    }
}
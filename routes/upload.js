const authguard = require('../middlewares/authguard')
const multer = require('multer')
const router = require('express').Router()
const UploadController = require('../controllers/upload')
const wrapAsync = require('../utils/wrapAsync')
const path = require('path')


const upload = multer({
    storage: multer.diskStorage({
        destination: function (req, file, cb) {
            cb(null, 'uploads/')
        },
        filename: function (req, file, cb) {
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
            cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
        }
    })
})

router.use(authguard)

router.route('/')
    .post(upload.array('images'), wrapAsync(UploadController.upload))


module.exports = router
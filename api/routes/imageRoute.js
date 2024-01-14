const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage() // Use memory storage for simplicity, adjust as needed

const upload = multer({ storage: storage })

const imageController = require('../controllers/imageController')

// const activityLogging = require('../middlewares/activityLogging')
// router.use(activityLogging)

router.post('/', imageController.getImage)
router.post('/upload', upload.single('image'), imageController.uploadImage)

module.exports = router
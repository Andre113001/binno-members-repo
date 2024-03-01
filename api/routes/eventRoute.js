const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage() // Use memory storage for simplicity, adjust as needed

const upload = multer({ storage: storage })

const eventController = require('../controllers/eventController')

// const activityLogging = require('../middlewares/activityLogging')
// router.use(activityLogging)

router.get('/', eventController.getAllEvents);
router.get('/:eventId', eventController.getEvent);
router.get('/user/:userId', eventController.getEventsByAuthor);
router.get('/img/:eventId', eventController.getEventImage);
router.post('/post', upload.single('image'), eventController.createUpdateEvent);
router.post('/delete', eventController.deleteEvent);

module.exports = router

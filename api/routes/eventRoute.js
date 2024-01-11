const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for simplicity, adjust as needed

const upload = multer({ storage: storage });

const eventController = require('../controllers/eventController');

router.get('/event/:eventId', eventController.eventFinder);
router.get('/all/:userId', eventController.fetchAllEvents);
router.get('/img/:eventId', eventController.getEventImage);
router.post('/post-event', upload.single('image'), eventController.createUpdateEvent);
router.get('/deleteEvent/:eventId', eventController.deleteEvent);

module.exports = router;
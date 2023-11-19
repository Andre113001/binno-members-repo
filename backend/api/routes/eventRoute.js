const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/event/:eventId', eventController.eventFinder);
router.post('/createUpdateEvent', eventController.createUpdateEvent);
router.get('/deleteEvent/:eventId', eventController.deleteEvent);

module.exports = router;
const express = require('express');
const router = express.Router();
const scheduleController = require('../controllers/scheduleController');

// Password route
router.get('/', scheduleController.getAllSchedule);
router.post('/sched-post', scheduleController.postSchedule);
router.post('/sched-resched', scheduleController.changeSchedule);
router.post('/sched-delete/:scheduleId', scheduleController.deleteSchedule);

module.exports = router;

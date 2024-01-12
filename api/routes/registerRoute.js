const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for simplicity, adjust as needed

const upload = multer({ storage: storage });

const applicationController = require('../controllers/registerController');

router.post('/check', applicationController.applicationChecker);

module.exports = router;
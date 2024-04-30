const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Password route
router.post('/description', profileController.updateDescription);
router.post('/contact', profileController.updateContactNum);
router.post('/tagline', profileController.updateTagline);
router.post('/address', profileController.updateAddress);
router.post('/links', profileController.updateLinks);
module.exports = router;

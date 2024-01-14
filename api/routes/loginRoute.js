const express = require('express');
const router = express.Router();
const loginController = require('../controllers/loginController');

// Login route
router.post('/', loginController.login);
router.post('/verify', loginController.verify_twoAuth);


module.exports = router;

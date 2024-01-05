const express = require('express');
const router = express.Router();
const passport = require('passport');

const facebookController = require('../controllers/facebookController');

router.get('/auth', passport.authenticate('facebook'));

module.exports = router;
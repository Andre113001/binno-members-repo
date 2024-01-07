const express = require('express');
const router = express.Router();
const passport = require('passport');

router.post('/auth', passport.authenticate('facebook-token'), (req, res) => {
  // If authentication succeeds, respond with a user object
  res.json(req.user);
});

module.exports = router;

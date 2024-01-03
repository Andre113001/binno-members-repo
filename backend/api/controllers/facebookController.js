const axios = require('axios');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');
const dotenv = require('dotenv');

const auth = passport.authenticate('facebook');

module.exports = {
  auth,
};

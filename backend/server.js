const dotenv = require('dotenv')
const express = require('express');
const path = require('path');
const passport = require('passport');
const FacebookTokenStrategy = require('passport-facebook-token');

dotenv.config();

const app = express();
const port = process.env.PORT;

// Require middleware functions
const corsMiddleware = require('./api/middlewares/corsMiddleware');
const jsonMiddleware = require('./api/middlewares/jsonMiddleware');
const urlencodedMiddleware = require('./api/middlewares/urlencodedMiddleware');

// Use Middleware
app.use(corsMiddleware);
app.use(jsonMiddleware);
app.use(urlencodedMiddleware);


app.use("/templates", express.static(path.join(__dirname, "./api/templates")));

// Passport configuration
passport.use(new FacebookTokenStrategy({
  clientID: "1503942416857064",
  clientSecret: "443801be90217c561d6f03d4744c8b06",
}, (accessToken, refreshToken, profile, done) => {
  // Use the profile information (e.g., profile.id) to find or create a user in your database
  // You can customize this part based on your user management system
  return done(null, profile);
}));

// Initialize Passport and restore authentication state, if any, from the session.
app.use(passport.initialize());

// Import Route Files
const memberRoute = require('./api/routes/memberRoute');
const blogRoute = require('./api/routes/blogRoute');
const eventRoute = require('./api/routes/eventRoute');
const postRoute = require('./api/routes/socMedPostRoute');
const programRoute = require('./api/routes/programRoute');
const loginRoute = require('./api/routes/loginRoute');
const passwordRoute = require('./api/routes/passwordRoute');
const facebookRoute = require('./api/routes/facebookRoute');

// Use Routes
app.use('/api/member', memberRoute);
app.use('/api/blog', blogRoute);
app.use('/api/event', eventRoute);
app.use('/api/post', postRoute);
app.use('/api/program', programRoute);
app.use('/api/login', loginRoute);
app.use('/api/password', passwordRoute);
app.use('/api/fb', facebookRoute);


app.get('/', (req, res) => {
  console.log("Connected");
})

app.listen(port, () => {
  console.log(`======================================`);
  console.log(`BiNNO backend listening on port ${port}`);
  console.log(`======================================`);
})
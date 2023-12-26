const dotenv = require('dotenv')
const mysql = require('mysql')

const express = require('express')
const cors = require('cors')
const session = require('express-session');
const { engine } = require('express-handlebars');
const path = require('path')


const app = express()
const port = 8080

app.use("/templates", express.static(path.join(__dirname, "./api/templates")));

app.engine('handlebars', engine());
app.set('view engine', 'ejs');
app.set('views', './api/views');

// Import Route Files
const memberRoute = require('./api/routes/memberRoute');
const blogRoute = require('./api/routes/blogRoute');
const eventRoute = require('./api/routes/eventRoute');
const postRoute = require('./api/routes/socMedPostRoute');
const programRoute = require('./api/routes/programRoute');

// Use Routes
app.use('/api/member-route', memberRoute);
app.use('/api/blog-route', blogRoute);
app.use('/api/event-route', eventRoute);
app.use('/api/post-route', postRoute);
app.use('/api/program-route', programRoute);

dotenv.config()

// const passport = require('passport')
// const facebook = require('passport-facebook')
// const linkedin = require('passport-linkedin')

// const facebookStrategy = facebook.Strategy

// passport.serializeUser(function (user, cb) {
//   cb(null, user)
// });

// passport.deserializeUser(function (obj, cb) {
//   cb(null, obj)
// });

// passport.use(new facebookStrategy({
//   clientID: process.env.FACEBOOK_ID,
//   clientSecret: process.env.FACEBOOK_S,
//   callbackURL: 'http://localhost:3001/fb/auth',
//   profileFields: ['id', 'displayName']
// },
//   function(accessToken, refreshToken, profile, done) {
//     console.log(accessToken, refreshToken, profile);
//     const user = {}
//     done(null, user)
//   }
// ))
// app.use(cors());

// app.use(session({
//   secret: process.env.FACEBOOK_S,
//   resave: true,
//   saveUninitialized: true
// }));

// app.use(passport.initialize())
// app.use(passport.session())

// app.use('/login/fb', passport.authenticate('facebook'));

// app.use('/failed/login', (req, res, next) => {
//   res.send('Login Failed');
// })

// app.use('/fb/auth', passport.authenticate('facebook',
//   {failureRedirect: '/failed/login'}), function(req, res) {
//     console.log(req.user, req.isAuthenticated());
//     res.send('logged in to facebook');
//   }
// );

// app.use('/logout', (req, res, next) => {
//   req.logout((err) => {
//     if (err) {
//       return next(err);
//     }
//     console.log(req.isAuthenticated());
//     res.send('user is logged out');
//   });
// });



// app.post('/post-to-facebook', (req, res) => {
//   // Check if the user is authenticated
//   if (!req.isAuthenticated()) {
//     return res.status(401).json({ error: 'User not authenticated' });
//   }

//   // Get the text to be posted from the request body
//   const { text } = req.body;

//   // Check if the text is provided
//   if (!text) {
//     return res.status(400).json({ error: 'Text is required' });
//   }

//   // Perform the logic to post the text to Facebook
//   // This is where you would use the Facebook API or SDK to post the text

//   // For demonstration purposes, we'll log the text to the console
//   console.log(`Text to be posted to Facebook: ${text}`);

//   // Respond with a success message
//   return res.status(200).json({ message: 'Text posted to Facebook successfully' });
// });



app.get('/', (req, res) => {
  res.render('main', {layout: false});
})

app.listen(port, () => {
  console.log(`======================================`)
  console.log(`BiNNO backend listening on port ${port}`)
  console.log(`======================================`)
})
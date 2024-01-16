const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
import { rateLimit } from 'express-rate-limit'

dotenv.config()

const app = express()
const port = process.env.PORT

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes).
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers.
    // store: ... , // Use an external store for consistency across multiple server instances.
})

// Apply the rate limiting middleware to all requests.
app.use(limiter)

// Require middleware functions
const corsMiddleware = require('./api/middlewares/corsMiddleware')
const jsonMiddleware = require('./api/middlewares/jsonMiddleware')
const urlencodedMiddleware = require('./api/middlewares/urlencodedMiddleware')

// Use Middleware
app.use(corsMiddleware)
app.use(jsonMiddleware)
app.use(urlencodedMiddleware)

app.use('/templates', express.static(path.join(__dirname, './api/templates')))
app.use('/static', express.static('public'))

// const activityLogging = require('./api/middlewares/activityLogging')
// app.use(activityLogging)

// Import Route Files
const memberRoute = require('./api/routes/memberRoute')
const blogRoute = require('./api/routes/blogRoute')
const eventRoute = require('./api/routes/eventRoute')
const postRoute = require('./api/routes/socMedPostRoute')
const programRoute = require('./api/routes/programRoute')
const loginRoute = require('./api/routes/loginRoute')
const passwordRoute = require('./api/routes/passwordRoute')
const registerRoute = require('./api/routes/registerRoute')
const imageRoute = require('./api/routes/imageRoute')

// Use Routes
app.use('/api/members', memberRoute)
app.use('/api/blogs', blogRoute)
app.use('/api/events', eventRoute)
app.use('/api/posts', postRoute)
app.use('/api/programs', programRoute)
app.use('/api/images', imageRoute)
app.use('/api/login', loginRoute)
app.use('/api/password', passwordRoute)
app.use('/api/register', registerRoute)

app.get('/', (req, res) => {
    console.log('Connected')
})

app.listen(port, () => {
    console.log(`======================================`)
    console.log(`BiNNO backend listening on port ${port}`)
    console.log(`======================================`)
})

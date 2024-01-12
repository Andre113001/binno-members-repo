const dotenv = require('dotenv')
const express = require('express')
const path = require('path')

dotenv.config()

const app = express()
const port = process.env.PORT

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
const registerRoute = require('./api/routes/registerRoute');

// Use Routes
app.use('/api/member', memberRoute)
app.use('/api/blog', blogRoute)
app.use('/api/event', eventRoute)
app.use('/api/post', postRoute)
app.use('/api/program', programRoute)
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

const dotenv = require('dotenv')
const express = require('express')
const path = require('path')
const cors = require('cors');

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
app.use(express.json({ limit: '50mb' }))


// app.use(cors({
//     origin: '*',
// }));

app.use('/public', express.static(path.join(__dirname, '../../public')));

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
const newsletterRoute = require('./api/routes/newsletterRoute')
// const testRoute = require('./api/routes/testingRoute')

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
app.use('/api/newsletter', newsletterRoute)
// app.use('/test', testRoute)


app.get('/', (req, res) => {
    res.status(200).json({  
        success: true,
        data: {
            message: "Connected!"
        }
    })
})

app.listen(port, () => {
    console.log(`======================================`)
    console.log(`BiNNO backend listening on port ${port}`)
    console.log(`======================================`)
})

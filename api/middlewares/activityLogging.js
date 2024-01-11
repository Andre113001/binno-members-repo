const morgan = require('morgan')
const jwt = require('jsonwebtoken')
const moment = require('moment-timezone')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')

const uploadHistory = async (author, text) => {
    const newId = uniqueId.uniqueIdGenerator()

    const date = new Date()
    await db.query(
        'INSERT INTO history_i (history_id, history_datecreated, history_author, history_text) VALUES (?, ? , ?, ?)',
        [newId, date, author, text.trim()]
    )
}

const activityLogging = (req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next()
    }

    const stream = {
        write: function (message) {
            console.log(message.trim())
        },
    }
    const customFormat = (tokens, req, res) => {
        const date = moment().tz('Asia/Manila').format('DD/MMM/YYYY:HH:mm:ss')
        return `[${date}] ${tokens['remote-addr'](req, res)} ${tokens.method(
            req,
            res
        )} ${tokens.url(req, res)} ${tokens.status(req, res)}`
    }
    // const customFormat = '[:date[clf]] :remote-addr :method :url :status'

    morgan(customFormat, { stream })(req, res, next)

    const token = req.headers.authorization.split(' ')[1] // Authorization: 'Bearer TOKEN'

    if (!token) {
        // throw new Error('Request denied!')
        if (req.url === '/api/login') console.log()
        return next()
    }

    const authData = jwt.verify(token, process.env.JWT_SECRET_KEY)

    // console.log(req.url)
    switch (req.url) {
        case '/api/blog/post-blog':
            console.log(authData.username, ' posted a new blog.')
            uploadHistory(authData.username, ' posted a new blog.')
            break
        case '/api/event/post-event':
            console.log(authData.username, ' posted a new event.')
            uploadHistory(authData.username, ' posted a new event.')
            break
        case '/api/program/create-update-program':
            console.log(authData.username, ' created a new program.')
            uploadHistory(authData.username, ' created a new program.')
            break
        case '/api/program/create-update-page':
            console.log(authData.username, ' created a new page.')
            uploadHistory(authData.username, ' created a new page.')
            break
        case '/api/post/upload':
            console.log(authData.username, ' made a post.')
            uploadHistory(authData.username, ' made a post.')
            break
        case '/api/post/update':
            console.log(authData.username, ' updated a post.')
            uploadHistory(authData.username, ' updated a post.')
            break

        default:
            if (req.url.includes('/delete-blog/')) {
                console.log(authData.username, ' deleted a blog.')
                uploadHistory(authData.username, ' deleted a blog.')
            }
            if (req.url.includes('/delete-program/')) {
                console.log(authData.username, ' delete a program.')
                uploadHistory(authData.username, ' delete a program.')
            }
            if (req.url.includes('/delete-page/')) {
                console.log(authData.username, ' deleted a page.')
                uploadHistory(authData.username, ' deleted a page.')
            }
            break
    }
}

module.exports = activityLogging

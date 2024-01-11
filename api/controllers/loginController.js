const db = require('../../database/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const hash = require('sha256')
const moment = require('moment-timezone')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')

// Reusable function to authenticate user and generate token
// Reusable function to authenticate user and generate token
const authenticateUser = async (accessKey, password) => {
    // Ensure accessKey is provided and not falsy
    if (!accessKey) {
        return Promise.resolve({ error: 'Access key is required' })
    }

    const hashedAccesskey = hash(accessKey).toString('base64')

    return new Promise((resolve, reject) => {
        db.query(
            `SELECT * FROM member_i WHERE member_accessKey = ?`,
            [hashedAccesskey],
            async (err, result) => {
                if (err) {
                    reject({ error: 'Internal server error' })
                }

                if (
                    result.length === 0 ||
                    !result[0].hasOwnProperty('member_password')
                ) {
                    resolve({ error: 'User not found' })
                }

                const DBpassword = result[0].member_password

                if (!DBpassword) {
                    resolve({ error: 'User password not found' })
                }

                const passwordMatch = await bcrypt.compare(password, DBpassword)

                if (passwordMatch) {
                    db.query(
                        'SELECT * FROM member_settings WHERE setting_id = ?',
                        [result[0].member_setting],
                        (err, user) => {
                            console.log(
                                user[0].setting_institution,
                                'logged in.'
                            )

                            const token = jwt.sign(
                                {
                                    userId: user[0].account_id,
                                    username: user[0].setting_institution,
                                },
                                process.env.JWT_SECRET_KEY,
                                { expiresIn: '1h' }
                            )

                            // Update token to database
                            db.query(
                                'UPDATE member_i SET member_access = ? WHERE member_id = ?',
                                [hash(token), result[0].member_id]
                            )

                            const date = new Date()
                            // const date = moment()
                            //     .tz('Asia/Manila')
                            //     .format('YYYY/MM/dd:HH:mm')

                            const newId = uniqueId.uniqueIdGenerator()
                            db.query(
                                'INSERT INTO history_i (history_id, history_datecreated, history_author, history_text) VALUES (?, ? , ?, ?)',
                                [
                                    newId,
                                    date,
                                    user[0].setting_institution,
                                    `${user[0].setting_institution} logged in.`,
                                ]
                            )

                            resolve({ token })
                        }
                    )
                } else {
                    resolve({ error: 'Authentication failed' })
                }
            }
        )
    })
}

// Controller to handle login request
const login = async (req, res) => {
    const { accessKey, password } = req.body

    try {
        // Destroy accesskey when logged out or by default
        const result = await authenticateUser(accessKey, password)
        if (result.error) {
            return res.status(401).json(result)
        }
        return res.json(result)
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const twoAuth = async (req, res) => {}

module.exports = {
    login,
    twoAuth,
}

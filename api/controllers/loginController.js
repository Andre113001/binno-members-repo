const db = require('../../database/db')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const hash = require('sha256')
const generateToken = require('../middlewares/generateTokenMiddleware');
const axios = require('axios');
const { promisify } = require('util');


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
                    const otpSent =  twoAuth(accessKey);
                    if (otpSent) {
                        resolve({ twoAuth: true })
                    }
                } else {
                    resolve({ twoAuth: false })
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

function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(100000 + Math.random() * 900000);
    return otp.toString();
  }

const twoAuth = async (accesskey) => {
    try {
        const convertedAccessKey = hash(accesskey);
        db.query("SELECT email_i.email_address FROM member_i INNER JOIN member_contact ON member_i.member_contact_id = member_contact.contact_email INNER JOIN email_i ON member_contact.contact_email = email_i.email_id WHERE member_i.member_accesskey = ?", [convertedAccessKey], (err, result) => {
            if (err) {
                console.log(err);
            }

            if (result.length > 0) {
                const email = result[0].email_address;
                const otp = generateOTP();
                const convertedOtp = hash(otp);

                const query = "UPDATE member_i SET member_twoauth = ?, member_twoauth_valid = DATE_ADD(NOW(), INTERVAL 30 MINUTE) WHERE member_accesskey = ?";
                const values = [convertedOtp, convertedAccessKey];

                db.query(query, values, (updateError, updateRes) => {
                    if (updateError) {
                        console.log(updateError);
                    }

                    if (updateRes.affectedRows > 0) {
                        // Email notif here
                        console.log(email, otp);
                        axios.post(`https://binno-email-production.up.railway.app/others/twoAuth`, {
                            receiver: email,
                            otp: otp
                        })
                        .then(response => {
                            console.log('Response from server', response.data);
                            return true;
                            // Add any additional logic here based on the response if needed
                        })
                        .catch(error => {
                            console.error('Error making request', error.message);
                            return false;
                            // Handle error 
                        });
                    } else {
                        console.error("Fields unsuccessfully updated");
                    }
                });
            } else {
                console.error("Email cannot be found");
            }
        });
    } catch (error) {
        console.log(error);
    }
}

const verify_twoAuth = async (req, res) => {
    const { otp, accesskey } = req.body;
    const hashedOtp = hash(otp);
    const hashedAccesskey = hash(accesskey);

    try {
        db.query("SELECT member_id, member_twoauth, member_twoauth_valid FROM member_i WHERE member_twoauth = ? AND member_accesskey = ?", [hashedOtp, hashedAccesskey], (err, result) => {
            if (result.length > 0) {
                if (new Date(result[0].member_twoauth_valid) > new Date()) {
                    const token = jwt.sign(
                        { userId: result[0].member_id, username: result[0].name },
                        process.env.JWT_SECRET_KEY
                    );
    
                    // // Update token to database
                    // await db.query(
                    //     'UPDATE member_i SET member_access = ? WHERE member_id = ?',
                    //     [hash(token), result[0].member_id], 
                    // );
    
                    return res.json({auth: true, token: token});
                } else {
                    return res.json({auth: false}); // Return false if the validation fails
                }
            } else {
                return res.json({auth: false}); // Return false if no record is found
            }
        });
    } catch (error) {
        console.error(error);
        return res.json({error: error}); // Return false in case of an error
    }

        
};

// const user = result[0]

// const token = jwt.sign(
//     { userId: user.account_id, username: user.name },
//     process.env.JWT_SECRET_KEY
// )

// // Update token to database
// db.query(
//     'UPDATE member_i SET member_access = ? WHERE member_id = ?',
//     [hash(token), result[0].member_id]
// )

module.exports = {
    login,
    verify_twoAuth,
}

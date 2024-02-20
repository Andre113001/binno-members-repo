const db = require('../../database/db');
const dotenv = require('dotenv');
const sha256 = require('sha256');
const axios = require('axios');

dotenv.config()

//Middlewares
const bcryptConverter = require('../middlewares/bcryptConverter');
const generateToken = require('../middlewares/generateTokenMiddleware');

const verifyChangePassword = async (req, res) => {
    const { accesskey } = req.body;

    try {
        const convertedAccessKey = sha256(accesskey);
        const getEmailAndInstitutionQuery = `
            SELECT email_i.email_address, member_settings.setting_institution FROM member_i
            INNER JOIN member_contact ON member_i.member_contact_id = member_contact.contact_email
            INNER JOIN email_i ON member_contact.contact_email = email_i.email_id
            LEFT JOIN member_settings ON member_i.member_setting = member_settings.setting_id
            WHERE member_i.member_accesskey = ?
        `;
        // NOTE: new query for the new database - AL
        // const getEmailAndInstitutionQuery = `
        //     SELECT contact_email, name FROM member_profile
        //     WHERE access_key = ?
        // `;
        db.query(getEmailAndInstitutionQuery, [convertedAccessKey], (err, result) => {
            if (err) {
                return res.status(500).json({ err });
            }

            if (result.length > 0) {
                const email = result[0].email_address;
                const name = result[0].setting_institution;
                const token = generateToken(32);
                const convertedToken = sha256(token);


                const updatePasswordResetTokenQuery = `
                    UPDATE member_i SET
                    member_resetpassword_token = ?,
                    member_resetpassword_token_valid = DATE_ADD(NOW(), INTERVAL 3 HOUR)
                    WHERE member_accesskey = ?`;
                // NOTE: new query for the new database - AL
                // const updatePasswordResetTokenQuery = `
                //     UPDATE member_profile SET
                //     password_reset_token = ?,
                //     password_reset_token_valid_date = DATE_ADD(NOW(), INTERVAL 3 HOUR)
                //     WHERE access_key = ?`;
                const values = [convertedToken, convertedAccessKey];

                db.query(updatePasswordResetTokenQuery, values, (updateError, updateRes) => {
                    if (updateError) {
                        return res.status(500).json({ error: updateError });
                    }

                    if (updateRes.affectedRows > 0) {
                        // Email notif here
                        axios.post(`${process.env.EMAIL_DOMAIN}/others/forgotPassword`, {
                            receiver: email,
                            name: name,
                            token: token
                        })
                            .then(response => {
                                console.log('Response from email server', response.data);
                                // Add any additional logic here based on the response if needed
                                return res.status(200).json({ message: "Email Sent" });
                            })
                            .catch(error => {
                                console.error('Error making request', error.message);
                                // Handle error
                                return res.status(500).json({ message: "Failed to send email" });
                            });
                    } else {
                        res.status(500).json({ result: "Fields unsuccessfully updated" });
                    }
                });
            } else {
                return res.status(200).json({ message: "Email cannot be found" });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

const resetTokenChecker = async (req, res) => {
    try {
        const { token } = req.body;

        const getPasswordResetTokenQuery = `
            SELECT member_id, member_resetpassword_token, member_resetpassword_token_valid
            FROM member_i
            WHERE member_resetpassword_token = ?
        `;
        // NOTE: new query for the new database - AL
        // const getPasswordResetTokenQuery = `
        //     SELECT member_id, password_reset_token, password_reset_token_valid_date
        //     FROM member_profile
        //     WHERE password_reset_token = ?
        // `;
        db.query(getPasswordResetTokenQuery, [sha256(token)], (err, result) => {
            if (result.length > 0) {
                const tokenData = result[0];
                const currentTimestamp = new Date().getTime();
                const tokenExpirationTimestamp = new Date(tokenData.member_resetpassword_token_valid).getTime();

                // Check if the token is still valid (not expired)
                if (currentTimestamp < tokenExpirationTimestamp) {
                    res.status(200).json({ message: 'Token is valid' });
                } else {
                    res.status(400).json({ message: 'Token has expired' });
                }
            } else {
                return res.status(500).json({ error: err });
            }
        });

    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: error });
    }
};

const changePassword = async (req, res) => {
    const { token, newPassword } = req.body
    try {
        const convertedPassword = await bcryptConverter(newPassword);
        const changePasswordQuery = `
            UPDATE member_i SET
            member_password = ?,
            member_resetpassword_token = NULL,
            member_resetpassword_token_valid = NULL
            WHERE member_resetpassword_token = ?
        `;
        // NOTE: new query for the new database - AL
        // const changePasswordQuery = `
        //     UPDATE member_profile SET
        //     password = ?,
        //     password_reset_token = NULL,
        //     password_reset_token_valid_date = NULL
        //     WHERE password_reset_token = ?
        // `;
        db.query(changePasswordQuery, [convertedPassword, sha256(token)], (updateError, updateRes) => {
            if (updateError) {
                // console.log(updateError);
                return res.status(500).json({ error: 'Failed to change password' });
            }

            if (updateRes.affectedRows > 0) {
                return res.status(200).json({ message: 'Password Changed Successfully' });
            } else {
                return res.status(500).json({ message: 'Failed to change password' });
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error });
    }
};

module.exports = {
    verifyChangePassword,
    resetTokenChecker,
    changePassword
}

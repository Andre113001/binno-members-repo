const db = require('../../database/db')
const dotenv = require('dotenv')
const axios = require('axios')
const { uniqueIdGenerator } = require('../middlewares/uniqueIdGeneratorMiddleware');
const sanitizeId = require('../middlewares/querySanitizerMiddleware')
const { updateEmailStat } = require('../middlewares/newsletterStatUpdater');

const subscribe = async (req, res) => {
    const { email } = req.body;
    const id = uniqueIdGenerator();

    // Checker
    try {
        // Check if email already is subscribed
        const verifyEmailQuery = "SELECT email_address, email_subscribe FROM email_i WHERE email_address = ?";
        // NOTE: new query for the new database - AL
        // const verifyEmailQuery = "SELECT email_address, subscribe FROM email WHERE email_address = ?";
        db.query(verifyEmailQuery, [sanitizeId(email)], (err, result) => {
            if (err) {
                res.json({ error: err });
            }

            if (result.length > 0) {
                // NOTE: change condition to - AL
                // if (result[0].subscribe === 0)
                if (result[0].email_subscribe === 0) {
                    const updateSubscriptionQuery = "UPDATE email_i SET email_subscribe = 1 WHERE email_address = ?";
                    // NOTE: new query for the new database - AL
                    // const updateSubscriptionQuery = "UPDATE email SET subscribe = 1 WHERE email_address = ?";
                    db.query(updateSubscriptionQuery, [sanitizeId(email)], (err, result) => {
                        if (err) {
                            res.json(err);
                        }

                        if (result.affectedRows > 0) {
                            res.json({ result: "Successfully Re-Subscribe" });
                        } else {
                            res.json({ result: "Attempt to Unsubscribe failed " });
                        }
                    })
                } else {
                    res.json({ result: "Already Subscribe" });
                }

                // if no email found then insert to email table
            } else {
                const insertEmailQuery = `
                    INSERT INTO email_i (
                        email_id,
                        email_datecreated,
                        email_address,
                        email_user_type
                    )
                    VALUES (?, NOW(), ?,  ?)
                `;
                // NOTE: new query for the new database - AL
                // const insertEmailQuery = `
                //     INSERT INTO email (
                //         email_id,
                //         date_created,
                //         email_address,
                //     )
                //     VALUES (?, NOW(), ?)
                // `;
                db.query(insertEmailQuery, [id, email, "subscriber"], (insertErr, insertRes) => {
                    if (insertErr) {
                        res.json({ insertError: insertErr });
                    }

                    if (insertRes.affectedRows > 0) {
                        updateEmailStat();
                        res.json({ result: "Email Added" });
                    } else {
                        res.json({ result: "Email Not Added" });
                    }
                })
            }
        });
    } catch (error) {
        console.log(error);
    }
}

// const check = async (req, res) => {
//     const { email } = req.query;

//     try {
//         db.query('SELECT * FROM email_i WHERE email_address = ?', [email], (err, result) => {
//             if (err) {
//                 console.log('An error occured on EmailCheck: ', err);
//             }

//             if (result.length > 0) {
//                 // axios.post()
//             }
//         })
//     } catch (error) {
//         console.log(error);
//     }
// }

// Unsubscribe function
const unsubscribe = async (req, res) => {
    const { email_id } = req.query;

    try {
        const unsubscribeQuery = "UPDATE email_i SET email_subscribe = 0 WHERE email_id = ?";
        // NOTE: new query for the new database - AL
        // const unsubscribeQuery = "UPDATE email SET subscribe = 0 WHERE email_id = ?";
        db.query(unsubscribeQuery, [email_id], (err, result) => {
            if (err) {
                res.json(err);
            }

            if (result.affectedRows > 0) {
                res.json({ result: "Successfully Unsubscribe" });
            } else {
                res.json({ result: "Attempt to Unsubscribe failed " });
            }
        })
    } catch (error) {
        res.json({ error: error });
    }
}

module.exports = {
    subscribe,
    unsubscribe,
}

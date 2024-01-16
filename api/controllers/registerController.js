const db = require('../../database/db');

//Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware');
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware');
const fs = require('fs');
const path = require('path');
const axios = require('axios');
const jwt = require('jsonwebtoken');

const express = require('express');
const bodyParser = require('body-parser');
const app = express();

const multer = require('multer');
const storage = multer.memoryStorage(); // Use memory storage for simplicity, adjust as needed

const upload = multer({ storage: storage, limits: { fileSize: 1024 * 1024 * 5 } });


// Parse JSON and url-encoded data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const getMemberByEmail = (memberEmail) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM email_i WHERE email_address = ?`
        db.query(sql, [sanitizeId(memberEmail)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const applicationChecker = (email, name) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = "SELECT * FROM application_i WHERE app_email = ? OR app_institution = ?"
        db.query(sql, [email, name], (err, data) => {
            if (err) {
                resolve(false);
            } else {
                db.query("SELECT setting_institution FROM setting_i WHERE setting_institution = ?", [name], (err, data) => {
                    if (err) {
                        resolve(false)
                    } else {
                        resolve(true);
                    }
                })
            }
        })
    })
};

const account_application = async (req, res) => {
    const { email, institution, address, type, classification } = req.body

    const id = uniqueId.appId_generator()

    try {
        // Check if email already exist in the database
        const result = await getMemberByEmail(email)
        if (result.length > 0) {
            return res.json({
                result: 'Sorry you are already registered to the platform',
            })
        } else {
            // Check if email is under processing in application
            db.query(
                'SELECT app_email, app_institution FROM application_i WHERE app_email = ? OR app_institution = ?',
                [email, institution],
                (EmailError, EmailResult) => {
                    // this must be modular
                    if (EmailError) {
                        // console.log(updateError);
                        return res.status(500).json({
                            error: 'Failed to retrieve Email from application',
                        })
                    }

                    if (EmailResult.length > 0) {
                        // Insert Email notif here
                        return res.json({result: 'processing'})
                        // axios
                        //     .post(
                        //         `http://localhost:3400/membership/ongoing/${email}`
                        //     )
                        //     .then((response) => {
                        //         console.log(
                        //             'Response from localhost:3002',
                        //             response.data
                        //         )
                        //     })
                        //     .catch((error) => {
                        //         console.error(
                        //             'Error making request',
                        //             error.message
                        //         )
                        //     })

                        // return res
                        //     .status(200)
                        //     .json({ message: 'Currently in processing' })
                    } else {
                        return res.json({appId: id});
                    }
                }
            )
        }
    } catch (error) {
        console.log(error)
        return res.status(500).json({ error: error })
    }
}


const upload_documents = async (req, res) => {
    const {address, classification, email, id, institution, type  } = req.body;
    const files = req.files;
    // Assuming the files are stored in req.files array by the 'upload' middleware
    // const files = req.files;

    try {
        // Insert application data into the database
        // console.log(email, institution, address, type, classification, id, files);
        // console.log(req.body);
        const uploadPath = path.join(__dirname, `../../private/docs/application/${id}`);

        // Create a directory for the application ID if it doesn't exist
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, {recursive: true});
        }

        // Process each uploaded file
        files.forEach((file, index) => {
            const originalName = file.originalname;
            const ext = path.extname(originalName);

            // Generate a new file name based on the applicationId
            const newFileName = `${id}_${index + 1}${ext}`;
            // Move the file to the destination folder
            console.log(newFileName);
            fs.writeFileSync(path.join(uploadPath, newFileName), file.buffer);
        });



        db.query(
            'INSERT INTO application_i (app_id, app_dateadded, app_institution, app_email, app_address, app_type, app_class, app_docs_path) VALUES (?, NOW(), ?, ?, ?, ?, ?, ?)',
            [id, institution, email, address, type, classification, uploadPath],
            async (insertError, insertResult) => {
                if (insertError) {
                    console.error('Error inserting application data:', insertError);
                    return res.json({ result: insertError });
                }

                if (insertResult.affectedRows > 0) {
                    // Application inserted successfully, now save files;
                    return res.json({ result: true });
                } else {
                    return res.json({ result: false });
                }
            }
        );
    } catch (error) {
        console.error('Error uploading files:', error.message);
        return res.status(500).json({ result: false });
    }
};




module.exports = {
    account_application, 
    upload_documents,
}
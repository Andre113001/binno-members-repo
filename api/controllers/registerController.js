const db = require('../../database/db');

//Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware');
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware');
const fs = require('fs');
const path = require('path');

const applicationChecker = async (req, res) => {
    const {email, name} = req.body;

    try {
        db.query("SELECT * FROM application_i WHERE app_email = ? OR app_institution = ?", [email, name], (err, result) => {
            if (err) {
                return res.status(500).json(err);
            }

            if (result.length > 0) {
                return res.status(200).json(true);
            } else {
                return res.status(500).json(false);
            }
        });
    } catch (error) {
        console.log(error);
    }
};


module.exports = {
    applicationChecker, 
}
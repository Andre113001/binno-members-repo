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
                res.status(500).json(err);
            }

            if (result.length > 0) {
                res.status(200).json(true);
            } else {
                res.status(500).json(false);
            }
        });
    } catch (error) {
        console.log(error);
    }
};

const uploadDocuments = async (req, res) => {
    // Assuming you have the applicationId available in your request or somewhere
    const { appId }= req.body; // Replace with your logic to get the applicationId

    // Path to the destination folder
    const destinationFolder = `./private/docs/application/${appId}`;

    // Create the destination folder if it doesn't exist
    if (!fs.existsSync(destinationFolder)) {
        fs.mkdirSync(destinationFolder, { recursive: true });
    }

    // Process each uploaded file
    req.files.forEach((file, index) => {
        const originalName = file.originalname;
        const ext = path.extname(originalName);

        // Generate a new file name based on the applicationId
        const newFileName = `${String(appId)}_${index + 1}${String(ext)}`;

        // Move the file to the destination folder
        fs.writeFileSync(path.join(destinationFolder, newFileName), file.buffer);
    });

    res.status(200).send('Files uploaded successfully!');
};


module.exports = {
    applicationChecker,
    uploadDocuments
}
const { uploadToLog } = require('../middlewares/activityLogger');

const testComponent = async (req, res) => {
    const { authorId, username, action, type, title } = req.body;

    const result = await uploadToLog(authorId, username, action, type, title);

    if (result) {
        res.status(200).json(`Activity Added to id ${authorId}`);
    } else {
        res.status(500).json(`Activity failed to upload to id ${authorId}`);
    }
    
}

module.exports = {
    testComponent
};
const { v4: uuidv4 } = require('uuid');
const db = require('../../database/db');

// Middleware to generate random hash unique IDs
const uniqueIdGenerator = () => {
    const uId = uuidv4();
    return uId;
};

module.exports = uniqueIdGenerator;
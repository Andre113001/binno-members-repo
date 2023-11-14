const db = require('../../database/db');

// Reusable function to get a member by ID
const getMemberById = (memberId) => {
    return new Promise((resolve, reject) => {
        const sql = "SELECT * FROM member_i WHERE member_id = ?";
        db.query(sql, [memberId], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// Controller to get a member by ID
const getMember = async (req, res) => {
    const { member_id } = req.params;

    try {
        const result = await getMemberById(member_id);
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(500).json({ error: 'Member does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

module.exports = {
    getMember,
};

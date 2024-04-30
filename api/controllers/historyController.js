const db = require('../../database/db');

const readMember = async (req, res) => {
    const { member_id } = req.body;
    try {
        db.query(`SELECT history_datecreated, history_text, history_type FROM history_i WHERE (history_type = "CHANGE_NAME" OR history_type = "CHANGE_CLASS") AND history_author = ? ORDER BY history_datecreated DESC`, [member_id], (err, result) => {
            if (err) {
                console.log(err);
                return;
            }

            res.json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const readChangeName = async (req, res) => {
    const { member_id } = req.body;
    try {
        db.query(`SELECT * FROM history_i WHERE history_type = "CHANGE_NAME" AND history_author = ? ORDER BY history_datecreated DESC`, [member_id], (err, result) => {
            if (err) {
                console.log(err);
                return;
            }

            res.json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

const readChangeClass = async (req, res) => {
    try {
        db.query(`SELECT * FROM history_i WHERE history_type = "CHANGE_CLASS" ORDER BY history_datecreated DESC`, [], (err, result) => {
            if (err) {
                console.log(err);
                return;
            }

            res.json(result);
        })
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
}

module.exports = {
    readMember,
    readChangeName,
    readChangeClass
}
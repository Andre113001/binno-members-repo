const db = require('../../database/db');

const updateDescription = async (req, res) => {
    const { member_id, newDesc } = req.body;

    try {
        const sql = `UPDATE member_settings SET setting_bio = ?, setting_datemodified = NOW() WHERE setting_memberId = ?`;

        db.query(sql, [ newDesc, member_id ], (errors, results) => {
            if (errors) {
                console.error(errors);
                return;
            }

            res.json(true);
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
};

const updateContactNum = async (req, res) => {
    const { member_id, newContact } = req.body;

    try {
        const sql = 'UPDATE member_contact INNER JOIN member_i on member_contact.contact_id = member_i.member_contact_id SET contact_number = ? WHERE member_contact.contact_id = member_i.member_contact_id AND member_id = ?';

        db.query(sql, [ newContact, member_id ], (errors, results) => {
            if (errors) {
                console.error(errors);
                return;
            }

            res.json(true);
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateTagline = async (req, res) => {
    const { member_id, newTagline } = req.body;

    try {
        const sql = `UPDATE member_settings SET setting_tagline = ?, setting_datemodified = NOW() WHERE setting_memberId = ?`;

        db.query(sql, [ newTagline, member_id ], (errors, results) => {
            if (errors) {
                console.error(errors);
                return;
            }

            res.json(true);
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateAddress = async (req, res) => {
    const { member_id, newAddress } = req.body;

    try {
        const sql = `UPDATE member_settings SET setting_address = ?, setting_datemodified = NOW() WHERE setting_memberId = ?`;

        db.query(sql, [ newAddress, member_id ], (errors, results) => {
            if (errors) {
                console.error(errors);
                return;
            }

            res.json(true);
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateLinks = async (req, res) => {
    const {member_id, companyLinks } = req.body;

    try {
        if (companyLinks.length > 0) {
            db.query('DELETE FROM member_web_link WHERE member_id = ?', [member_id], (error, results) => {
                if (error) {
                    console.error('Error deleting member_web_link records:', error);
                }
            });

            for (const link of companyLinks) {
                db.query(
                    'INSERT INTO member_web_link (link_id, url, member_id, date_created) VALUES (?, ?, ?, NOW())',
                    [link.link_id, link.url, member_id],
                    (insertError, insertResult) => {
                        if (insertError) {
                            return db.rollback(() => {
                                console.error('Failed to insert company link', insertError);
                                // Do not send response here
                            });
                        }
                    }
                );
            }
            
            res.json(true);
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    updateDescription,
    updateContactNum,
    updateTagline,
    updateAddress,
    updateLinks
}


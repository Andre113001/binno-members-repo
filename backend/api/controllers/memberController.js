const db = require('../../database/db');
const validator = require('validator')

// Reusable function to get a member by ID
const getMemberById = (memberId) => {
    return new Promise((resolve, reject) => {
        // Validate and sanitize user input
        const sanitizedMemberId = validator.escape(String(memberId));

        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM member_i WHERE member_id = ?`;  
        db.query(sql, [sanitizedMemberId], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// Reusable to fetch profile details
const getProfileSettings = (settingId) => {
    return new Promise ((resolve, reject) => {
        // Validate and sanitize user input
        const sanitizedMemberId = validator.escape(String(settingId));

        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM member_settings WHERE setting_id = ?`;  
        db.query(sql, [sanitizedMemberId], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

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

// Controller to update user's profile
const updateProfile = async (req, res) => {
    const { member_id, new_setting_bio, new_setting_color } = req.body;

    try {
        const result = await getMemberById(member_id);

        if (result.length > 0) {
            const getSettingsResult = await getProfileSettings(result[0].member_setting);
            if (getSettingsResult.length > 0) {
                db.query("UPDATE member_settings SET setting_bio = ?, setting_color = ?, setting_datemodified = NOW() WHERE setting_id = ?", [new_setting_bio, new_setting_color, result[0].member_setting], (updateError, updateRes) => {
                    if (updateError) {
                        return res.status(500).json({ error: 'Failed to update profile' });
                    }
    
                    if (updateRes.affectedRows > 0) {
                        return res.status(200).json({ message: 'Profile updated successfully' });
                    } else {
                        return res.status(500).json({ message: 'Failed to update profile' });
                    }
                });
            } else {
                return res.send('No Setting ID Set')
            }
        } else {
            return res.status(500).json({ error: 'Member does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Change status of member [Active, Vacation]
const changeStatus = async (req, res) => {
    const { member_id } = req.params;

    try {
        // Fetch the current status of the member
        const result = await getMemberById(member_id);

        if (result.length > 0) {
            const settingFetch = await getProfileSettings(result[0].member_setting);

            // console.log(settingFetch[0].setting_status);

            // // Toggle the status value (1 to 0 and vice versa)
            const newStatus = settingFetch[0].setting_status === 1 ? 0 : 1;

            // Update the member status in the database
            db.query("UPDATE member_settings SET setting_status = ? WHERE setting_id = ?", [newStatus, settingFetch[0].setting_id], (updateError, updateRes) => {
                if (updateError) {
                    // console.log(updateError);
                    return res.status(500).json({ error: 'Failed to update member status' });
                }

                if (updateRes.affectedRows > 0) {
                    return res.status(200).json({ message: 'Member status updated successfully' });
                } else {
                    return res.status(500).json({ message: 'Failed to update member status' });
                }
            });
        } else {
            return res.status(500).json({ error: 'Member does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    getMember,
    updateProfile,
    changeStatus,
};


// Task: 11/15/2023
// Get Profile Details ✅
// Update Profile Details ✅
// Vacation Mode - Deaactivation / Change visibility ✅ 

//INNER JOIN member_type ON member_i.member_type = member_type.user_type_id 
// INNER JOIN member_settings ON member_i.member_setting = member_settings.setting_id 
// INNER JOIN member_contact ON member_i.member_contact_id = member_contact.contact_id 
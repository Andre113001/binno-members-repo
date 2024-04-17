const db = require('../../database/db')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')
const sha256 = require('sha256')
const axios = require('axios')
const bcrypt = require('bcryptjs')

dotenv.config()

//Middlewares
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')
const sanitizedMemberId = require('../middlewares/querySanitizerMiddleware')
const bcryptConverter = require('../middlewares/bcryptConverter')
const generateToken = require('../middlewares/generateTokenMiddleware')
const { uploadToLog } = require('../middlewares/activityLogger');

// Reusable function to get a member by ID
const getMemberById = (memberId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT member_i.*, member_settings.*, member_contact.contact_number , email_i.email_address FROM member_i 
            INNER JOIN member_settings ON member_settings.setting_memberId = member_i.member_id 
            INNER JOIN member_contact ON member_contact.contact_id = member_i.member_contact_id
            INNER JOIN email_i ON member_contact.contact_email = email_i.email_id
            WHERE member_id = ?`
        db.query(sql, [sanitizedMemberId(memberId)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const fetchEnablers = async (req, res) => {
    const query = await new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT member_i.member_id, member_settings.*, email_i.email_address, member_contact.contact_number FROM member_i INNER JOIN member_settings ON member_i.member_setting = member_settings.setting_id INNER JOIN member_contact ON member_i.member_contact_id = member_contact.contact_id INNER JOIN email_i ON member_contact.contact_email = email_i.email_id WHERE member_type = '2' AND member_first_time = 0 AND member_restrict IS NULL AND member_flag = 1`
        db.query(sql, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

    res.status(200).json(query)
}
const fetchCompanies = async (req, res) => {
    const query = await new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
        SELECT member_i.member_id, member_settings.*, email_i.email_address, member_contact.contact_number FROM member_i INNER JOIN member_settings ON member_i.member_setting = member_settings.setting_id INNER JOIN member_contact ON member_i.member_contact_id = member_contact.contact_id INNER JOIN email_i ON member_contact.contact_email = email_i.email_id WHERE member_type = '1' AND member_first_time = 0 AND member_restrict IS NULL AND member_flag = 1`
        db.query(sql, (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })

    res.status(200).json(query)
};

const getMemberByEmail = (memberEmail) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM email_i WHERE email_address = ?`
        db.query(sql, [sanitizedMemberId(memberEmail)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const getMemberByAccessKey = (accesskey) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT member_i.member_id FROM member_i WHERE member_accesskey = ?`
        db.query(sql, [sanitizedMemberId(sha256(accesskey))], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const fetchMemberByAccessToken = (accessToken) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT 
                    member_i.member_id,
                    member_i.member_first_time,
                    member_i.member_type,
                    member_settings.setting_address,
                    member_settings.setting_id,
                    member_settings.setting_bio, 
                    member_settings.setting_tagline,
                    member_settings.class_change_valid_date,
                    member_settings.institution_change_valid_date,
                    member_settings.setting_color,
                    member_settings.setting_coverpic,
                    member_settings.setting_institution,
                    member_settings.setting_profilepic,
                    member_settings.enabler_class,
                    member_contact.contact_number, 
                    member_contact.contact_facebook, 
                    member_type.user_type,
                    email_i.email_address
                    FROM member_i
                    INNER JOIN member_settings ON member_i.member_setting = member_settings.setting_id
                    INNER JOIN member_type ON member_i.member_type = member_type.user_type_id
                    INNER JOIN member_contact ON member_i.member_contact_id = member_contact.contact_id
                    INNER JOIN email_i ON member_contact.contact_email = email_i.email_id
                    WHERE member_i.member_access = ?`
        db.query(sql, [sha256(sanitizedMemberId(accessToken))], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

const fetchCompanyLinks = async (member_id) => {
    return new Promise((resolve, reject) => {
        const sql = `SELECT link_id, url FROM member_web_link WHERE member_id = ?`;

        db.query(sql, [member_id], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        })
    })
}

// const removeCompanyLinks = async (req, res) => {
//     const {  }
// }

// Reusable to fetch profile details
const getProfileSettings = (settingId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM member_settings WHERE setting_id = ?`
        db.query(sql, [sanitizedMemberId(settingId)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Controller to get a member by ID
const getMember = async (req, res) => {
    const { member_id } = req.params

    try {
        const result = await getMemberById(member_id)
        if (result.length > 0) {
            return res.json(result)
        } else {
            return res.status(500).json({ error: 'Member does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Controller to get a member by Access Token
const fetchProfileByToken = async (req, res) => {
    const { accessToken } = req.params

    try {
        const result = await fetchMemberByAccessToken(accessToken)
        if (result.length > 0) {
            return res.json(result)
        } else {
            console.log(result)
            return res.status(500).json({ error: 'Member does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const getCompanyLinks = async (req, res) => {
    const { member_id } = req.params;

    try {
        const result = await fetchCompanyLinks(member_id);
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(500).json({ error: 'Member does not have company links yet.' });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
};

const removeCompanyLink = async (req, res) => {
    const { link_id } = req.body;

    try {
        const sql  = `DELETE FROM member_web_link WHERE link_id = ?`;

        db.query(sql, [link_id], (deleteErr, deleteRes) => {
            if (deleteErr) {
                console.log(deleteErr);
                res.json(false);
                return;
            } else {
                res.json(true);
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const addUpdateCompanyLink = async (req, res) => {
    const {member_id, link_id, url} = req.body;

    try {
        const member = getMemberById(member_id);

        console.log(member);

        const result = new Promise((resolve, reject) => {
            db.query(`SELECT * FROM member_web_link WHERE link_id = ?`, [link_id], (linkErr, linkRes) => {
                if (linkErr) {
                    reject(linkErr);
                } else {
                    resolve(linkRes);
                }
            })
        })

        res.json(result);
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
};

const changePassword = async (req, res) => {
    const { member_id, current_password, new_password } = req.body;

    try {
        const check_pw = await passwordChecker(current_password, member_id);
        
        if (!check_pw) {
            res.json('Invalid Current Password');
            return;
        } else if (current_password === new_password) {
            res.json('Current Password and New Password are same.');
            return;
        }

        const convertedPw = await bcryptConverter(new_password);
        const sql = `UPDATE member_i SET member_password = ? WHERE member_id = ?`;

        db.query(sql, [convertedPw, member_id], (updateErr, updateRes) => {
            if (updateErr) {
                console.log(updateErr);
                res.json('Internal Server Error');
                return;
            }

            res.json('Password Changed Sucessfully');
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const passwordChecker = async (password, member_id) => {
    const result = await getMemberById(member_id)
    const passwordMatch = await bcrypt.compare(password, result[0].member_password)
    return passwordMatch;
}

const changeInstituteName = async (req, res) => {
    const { member_id, newName, pw } = req.body;

    try {
        const result = await passwordChecker(pw, member_id);
        if (!result) {
            res.json(false);
            return;
        }

        const sql = "UPDATE member_settings SET setting_institution = ?, institution_change_valid_date = DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 YEAR), '%Y-%m-%d') WHERE setting_memberId = ?";

        db.query(sql, [newName, member_id], (updateErr, updateRes) => {
            if (updateErr) {
                console.log(updateErr);
                return;
            }

            const logRes = uploadToLog(
                member_id, "CHANGE_NAME", '', '', 'Changed their name to', `${newName}`, ""
            )

            if (logRes) {
                res.json(true);
            }

        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
};

const changeEnablerClass = async (req, res) => {
    const { member_id, newClass, pw } = req.body;

    try {
        const result = await passwordChecker(pw, member_id);
        if (!result) {
            res.json(false);
            return;
        }

        const sql = "UPDATE member_settings SET enabler_class = ?, class_change_valid_date = DATE_FORMAT(DATE_ADD(NOW(), INTERVAL 1 YEAR), '%Y-%m-%d') WHERE setting_memberId = ?";

        db.query(sql, [newClass, member_id], (updateErr, updateRes) => {
            if (updateErr) {
                console.log(updateErr);
                return;
            }
            const logRes = uploadToLog(
                member_id, "CHANGE_CLASS", '', '', 'Changed their Classification to', `${newClass}`, ""
            )

            if (logRes) {
                res.json(true);
            }
        })
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Controller to update user's profile
const updateProfile = async (req, res) => {
    const {
        member_id,
        bio, 
        contactNum,
        email,
        tagline,
        address,
        companyLinks
    } = req.body

    try {
        const result = await getMemberById(member_id);

        if (result.length > 0) {
            const getSettingsResult = await getProfileSettings(
                result[0].member_setting
            )
            if (getSettingsResult.length > 0) {
                db.beginTransaction((transactionError) => {
                    if (transactionError) {
                        return res.status(500).json({ error: 'Failed to begin transaction' });
                    }

                    db.query('DELETE FROM member_web_link WHERE member_id = ?', [member_id], (error, results) => {
                        if (error) {
                            console.error('Error deleting member_web_link records:', error);
                        }
                    });
                    
                    if (companyLinks.length > 0) {
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
                    }
                    
                    db.query(
                        'UPDATE member_settings SET setting_bio = ?, setting_address = ?, setting_tagline = ?, setting_datemodified = NOW() WHERE setting_id = ?',
                        [bio, address, tagline, result[0].member_setting],
                        (updateError1, updateRes1) => {
                            if (updateError1) {
                                return db.rollback(() => {
                                    console.error('Failed to update profile', updateError1);
                                    // Do not send response here
                                });
                            }

                            db.query(
                                'UPDATE member_contact INNER JOIN email_i on member_contact.contact_email = email_i.email_id SET contact_number = ?, email_address = ? WHERE contact_id = ?',
                                [contactNum, email, result[0].member_contact_id],
                                (updateError2, updateRes2) => {
                                    if (updateError2) {
                                        return db.rollback(() => {
                                            console.error('Failed to update contact number', updateError2);
                                            // Do not send response here
                                        });
                                    }

                                    db.commit((commitError) => {
                                        if (commitError) {
                                            return db.rollback(() => {
                                                console.error('Failed to commit transaction', commitError);
                                                res.status(500).json({ error: 'Failed to commit transaction', error_text: commitError });
                                            });
                                        }

                                        res.status(200).json({
                                            message: 'Profile settings and contact updated successfully',
                                        });
                                    });
                                }
                            );
                        }
                    );
                });                
                
            } else {
                return res.send('No Setting ID Set')
            }
        } else {
            return res.status(500).json({ error: 'Member does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updateProfilePic = async (req, res) => {
    try {
        const { newProfilePic, id } = req.body;
        db.query('UPDATE member_settings SET setting_profilepic = ? WHERE setting_id = ?', [newProfilePic, id], (err, result) => {
            if (err) {
                console.log(err);
            }

            if (result.affectedRows > 0) {
                return res.json('Profile Pic Updated');
            } else {
                return res.json('Profile Pic Not Updated');
            }
        })
    } catch (error) {
        console.log('error: ', error);
    }
}

const updateCoverPic = async (req, res) => {
    try {
        const { newCoverPic, id } = req.body;
        db.query('UPDATE member_settings SET setting_coverpic = ? WHERE setting_id = ?', [newCoverPic, id], (err, result) => {
            if (err) {
                console.log(err);
            }

            if (result.affectedRows > 0) {
                return res.json('Cover Pic Updated');
            } else {
                return res.json('Cover Pic Not Updated');
            }
        })
    } catch (error) {
        console.log('error: ', error);
    }
}

// Change status of member [Active, Vacation]
const changeStatus = async (req, res) => {
    const { member_id } = req.params

    try {
        // Fetch the current status of the member
        const result = await getMemberById(member_id)

        if (result.length > 0) {
            const settingFetch = await getProfileSettings(
                result[0].member_setting
            )

            // console.log(settingFetch[0].setting_status);

            // // Toggle the status value (1 to 0 and vice versa)
            const newStatus = settingFetch[0].setting_status === 1 ? 0 : 1

            // Update the member status in the database
            db.query(
                'UPDATE member_settings SET setting_status = ? WHERE setting_id = ?',
                [newStatus, settingFetch[0].setting_id],
                (updateError, updateRes) => {
                    if (updateError) {
                        // console.log(updateError);
                        return res
                            .status(500)
                            .json({ error: 'Failed to update member status' })
                    }

                    if (updateRes.affectedRows > 0) {
                        return res.status(200).json({
                            message: 'Member status updated successfully',
                        })
                    } else {
                        return res
                            .status(500)
                            .json({ message: 'Failed to update member status' })
                    }
                }
            )
        } else {
            return res.status(500).json({ error: 'Member does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    getMember,
    fetchProfileByToken,
    getCompanyLinks,
    removeCompanyLink,
    addUpdateCompanyLink,
    changePassword,
    updateProfile,
    changeInstituteName,
    changeEnablerClass,
    changeStatus,
    fetchEnablers,
    fetchCompanies,
    updateProfilePic,
    updateCoverPic
}
const db = require('../../database/db');

const fetchBlogs = async (req, res) => {
    try {
        db.query(`SELECT blog_id, setting_institution,blog_dateadded, blog_title, blog_content, setting_profilepic FROM blog_i INNER JOIN member_settings ON blog_i.blog_author = member_settings.setting_memberId WHERE blog_flag = 1 ORDER BY blog_dateadded DESC LIMIT 5`, [], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const fetchEvents = async (req, res) => {
    try {
        db.query(`SELECT event_id, setting_institution, event_address, event_date, event_time, event_title, event_description, setting_profilepic FROM event_i INNER JOIN member_settings ON member_settings.setting_memberId = event_i.event_author WHERE event_flag = 1 ORDER BY event_datecreated DESC LIMIT 5`, [], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            res.json(result);
        });
    } catch (error) {
        console.error(error);   
        res.status(500).json(error);
    }   
}

const fetchGuides = async (req, res) => {
    try {
        db.query(`SELECT program_id, setting_institution, program_dateadded, program_heading, setting_profilepic FROM program_i INNER JOIN member_settings ON member_settings.setting_memberId = program_i.program_author WHERE program_flag = 1 ORDER BY program_dateadded DESC LIMIT 5`, [], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

const fetchFaq = async (req, res) => {
    try {
        db.query(`SELECT faq_id, faq_datecreated, faq_title, faq_content FROM faq_i WHERE faq_flag = 1 ORDER BY faq_datecreated DESC`, [], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            res.json(result);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const postUaq = async (req, res) => {
    const { email, content } = req.body;
    try {
        db.query(`INSERT INTO uaq_i (uaq_dateadded, uaq_email, uaq_content) VALUES (NOW(), ?, ?)`, [email, content], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            res.json(true);
        });
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

const fetchCompanyProfile = async (req, res) => {
    try {
        db.query(`SELECT setting_id, setting_institution, setting_tagline, setting_profilepic, setting_coverpic
        FROM member_settings 
        INNER JOIN member_i ON member_i.member_id = member_settings.setting_memberId 
        WHERE setting_status = 1 
        AND member_flag = 1 
        AND member_type = 1
        AND member_first_time = 0 
        ORDER BY setting_datecreated DESC 
        LIMIT 4`, [], (err, result) => {
            if (err) {
                console.error(err);
                return;
            } 

            res.json(result);
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const fetchEnablerProfile = async (req, res) => {
    try {
        db.query(`SELECT setting_id, setting_institution, setting_profilepic, setting_coverpic 
        FROM member_settings 
        INNER JOIN member_i ON member_i.member_id = member_settings.setting_memberId 
        WHERE setting_status = 1 
        AND member_flag = 1 
        AND member_type = 2
        AND member_first_time = 0 
        ORDER BY setting_datecreated DESC 
        LIMIT 4`, [], (err, result) => {
            if (err) {
                console.error(err);
                return;
            } 

            res.json(result);
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const fetchMentorProfile = async (req, res) => {
    try {
        db.query(`SELECT setting_id, setting_institution, setting_profilepic, setting_coverpic 
        FROM member_settings 
        INNER JOIN member_i ON member_i.member_id = member_settings.setting_memberId 
        WHERE setting_status = 1 
        AND member_flag = 1 
        AND member_type = 3
        AND member_first_time = 0 
        ORDER BY setting_datecreated DESC 
        LIMIT 4`, [], (err, result) => {
            if (err) {
                console.error(err);
                return;
            } 

            res.json(result);
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const fetchCountMetrics = async (req, res) => {
    try {
        const companies = await new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(member_id) as count FROM member_i WHERE member_flag = 1 AND member_type = 1`, [], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                resolve(result);
            })
        });

        const enablers = await new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(member_id) as count FROM member_i WHERE member_flag = 1 AND member_type = 2`, [], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                resolve(result);
            })
        });

        const mentors = await new Promise((resolve, reject) => {
            db.query(`SELECT COUNT(member_id) as count FROM member_i WHERE member_flag = 1 AND member_type = 3`, [], (err, result) => {
                if (err) {
                    reject(err);
                    return;
                }
    
                resolve(result);
            })
        });

        res.json({
            companies: companies[0].count, 
            enablers: enablers[0].count,
            mentors: mentors[0].count
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const fetchCompanyLinks = async (req, res) => {
    const { member_id } = req.params;

    try {
        db.query(`SELECT url FROM member_web_link WHERE member_id = ?`, [member_id], (err, result) => {
            if (err) {
                console.error(err);
                return;
            }

            res.json(result)
        })
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};

const fetchEnablerClass = async (req, res) => {
    const { member_id } = req.params;

    try {
        const enablerClass = await new Promise((resolve, reject) => {
            db.query(`SELECT enabler_class FROM member_settings WHERE setting_memberId = ?`, [member_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    let convertedClass;
                    switch (result[0].enabler_class) {
                        case "LGU":
                            convertedClass = "Local Government Unit";
                            break;
                        case "SUC":
                            convertedClass = "State Universities & Colleges";
                            break;
                        case "TBI":
                            convertedClass = "Technology Business Incubator";
                            break;
                        default:
                            convertedClass = "Startup Enabler";
                            break;
                    }
                    resolve(convertedClass);
                }
            });
        });
        
        res.json(enablerClass);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
};


module.exports = {
    fetchBlogs,
    fetchEvents,
    fetchGuides,
    fetchFaq,
    postUaq,
    fetchCompanyProfile,
    fetchEnablerProfile,
    fetchMentorProfile,
    fetchCountMetrics,
    fetchCompanyLinks,
    fetchEnablerClass
}
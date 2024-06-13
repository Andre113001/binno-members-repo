const db = require('../../database/db');

/**
 * Retrieves the latest 5 non-archived blogs.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the blog details.
 */
async function fetchBlogs(req, res) {
    console.log("GET /api/public/blogs");
    console.log("fetchBlogs()");

    try {
        const getBlogsQuery = `
            SELECT
                blog_id,
                setting_institution,
                blog_dateadded,
                blog_title,
                blog_content,
                setting_profilepic
            FROM blog_i
            INNER JOIN member_settings
                ON blog_i.blog_author = member_settings.setting_memberId
            WHERE blog_flag = 1
            ORDER BY blog_dateadded DESC
            LIMIT 5
        `;

        const blogs = await new Promise((resolve, reject) => {
            db.query(getBlogsQuery, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return res.status(200).json(blogs);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Retrieves the latest 5 non-archived events.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the event details.
 */
async function fetchEvents(req, res) {
    console.log("GET /api/public/events");
    console.log("fetchEvents()");

    try {
        const getEventsQuery = `
            SELECT
                event_id,
                setting_institution,
                event_address,
                event_date,
                event_time,
                event_title,
                event_description,
                setting_profilepic
            FROM event_i
            INNER JOIN member_settings
                ON member_settings.setting_memberId = event_i.event_author
            WHERE event_flag = 1
            ORDER BY event_datecreated DESC
            LIMIT 5
        `;

        const events = await new Promise((resolve, reject) => {
            db.query(getEventsQuery, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return res.status(200).json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Retrieves the latest 5 non-archived guides.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the guide details.
 */
async function fetchGuides(req, res) {
    console.log("GET /api/public/guides");
    console.log("fetchGuides()");
    try {
        const getGuidesQuery = `
            SELECT
                program_id,
                setting_institution,
                program_dateadded,
                program_heading,
                setting_profilepic
            FROM program_i
            INNER JOIN member_settings
                ON member_settings.setting_memberId = program_i.program_author
            WHERE program_flag = 1
            ORDER BY program_dateadded DESC
            LIMIT 5
        `;

        const guides = await new Promise((resolve, reject) => {
            db.query(getGuidesQuery, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return res.status(200).json(guides);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Retrieves the list of non-archived FAQs.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} A Promise that resolves to an object containing the FAQ details.
 */
async function fetchFaq(req, res) {
    console.log("GET /api/public/uaq");
    console.log("fetchFaq()");

    try {
        const faqs = await new Promise((resolve, reject) => {
            const query = `
                SELECT faq_id, faq_datecreated, faq_title, faq_content
                FROM faq_i
                WHERE faq_flag = 1
                ORDER BY faq_datecreated DESC
            `;

            db.query(query, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });
        return res.status(200).json(faqs);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Creates a user-submitted question (UAQ) and stores it in the database.
 *
 * @param {Object} req - The request object containing the question and sender's email.
 * @param {Object} req.body - The body of the request.
 * @param {string} req.body.email - The email of the sender (optional).
 * @param {string} req.body.content - The question submitted by the user.
 * @param {Object} res - The response object.
 * @returns {boolean} A boolean signifying the succession of sending a UAQ.
 */
async function postUaq(req, res) {
    console.log("POST /api/public/uaq");
    console.log("postUaq()");
    const { email, content } = req.body;

    try {
        await new Promise((resolve, reject) => {
            const query = `
                INSERT INTO uaq_i (uaq_dateadded, uaq_email, uaq_content)
                VALUES (NOW(), ?, ?)
            `;

            db.query(query, [email, content], (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return res.status(200).json(true);
    } catch (error) {
        console.error(error);
        res.status(500).json(error);
    }
}

/**
 * Fetches 4 profiles of companies.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the company profiles.
 */
async function fetchCompanyProfile(req, res) {
    console.log("GET /api/public/profile/company");
    console.log("fetchCompanyProfile()");

    try {
        const getCompanyProfilesQuery = `
            SELECT
                setting_id,
                setting_institution,
                setting_tagline,
                setting_profilepic,
                setting_coverpic
            FROM member_settings
            INNER JOIN member_i
                ON member_i.member_id = member_settings.setting_memberId
            WHERE setting_status = 1
                AND member_flag = 1
                AND member_type = 1
                AND member_first_time = 0
            ORDER BY setting_datecreated DESC
            LIMIT 4
        `;

        const profiles = await new Promise((resolve, reject) => {
            db.query(getCompanyProfilesQuery, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Fetches 4 profiles of enablers.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the company profiles.
 */
async function fetchEnablerProfile(req, res) {
    console.log("GET /api/public/profile/enabler");
    console.log("fetchEnablerProfile()");

    try {
        const getEnablerProfilesQuery = `
            SELECT
                setting_id,
                setting_institution,
                setting_tagline,
                setting_profilepic,
                setting_coverpic
            FROM member_settings
            INNER JOIN member_i
                ON member_i.member_id = member_settings.setting_memberId
            WHERE setting_status = 1
                AND member_flag = 1
                AND member_type = 2
                AND member_first_time = 0
            ORDER BY setting_datecreated DESC
            LIMIT 4
        `;

        const profiles = await new Promise((resolve, reject) => {
            db.query(getEnablerProfilesQuery, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Fetches 4 profiles of mentors.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the company profiles.
 */
async function fetchMentorProfile(req, res) {
    console.log("GET /api/public/profile/mentor");
    console.log("fetchMentorProfile()");

    try {
        const getMentorProfilesQuery = `
            SELECT
                setting_id,
                setting_institution,
                setting_tagline,
                setting_profilepic,
                setting_coverpic
            FROM member_settings
            INNER JOIN member_i
                ON member_i.member_id = member_settings.setting_memberId
            WHERE setting_status = 1
                AND member_flag = 1
                AND member_type = 4
                AND member_first_time = 0
            ORDER BY setting_datecreated DESC
            LIMIT 4
        `;

        const profiles = await new Promise((resolve, reject) => {
            db.query(getMentorProfilesQuery, (error, result) => {
                if (error) reject(error);
                else resolve(result);
            });
        });

        return res.status(200).json(profiles);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Fetches the count of companies, enablers, and mentors.
 *
 * @param {Object} req - The request object.
 * @param {Object} res - The response object.
 * @returns {Promise<Object>} - A promise that resolves with the counts of different member types.
 */
async function fetchCountMetrics(req, res) {
    console.log("GET /api/public/metrics");
    console.log("fetchCountMetrics()");

    try {
        const memberCountQuery = `
            SELECT COUNT(member_id) as count
            FROM member_i
            WHERE member_flag = 1 AND member_type = ?
        `;

        const companies = await new Promise((resolve, reject) => {
            db.query(memberCountQuery, 1, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const enablers = await new Promise((resolve, reject) => {
            db.query(memberCountQuery, 2, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        const mentors = await new Promise((resolve, reject) => {
            db.query(memberCountQuery, 3, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json({
            companies: companies[0].count,
            enablers: enablers[0].count,
            mentors: mentors[0].count
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

/**
 * Fetches web links associated with a specific company.
 *
 * @param {Object} req - The request object.
 * @param {Object} req.params - The request parameters.
 * @param {string} req.params.member_id - The ID of the member whose links are being fetched.
 * @param {Object} res - The response object.
 * @returns {Promise<void>} - A promise that resolves with the member's web links.
 */
async function fetchCompanyLinks(req, res) {
    const { member_id } = req.params;
    console.log(`GET /api/public/links/${member_id}`);
    console.log("fetchCompanyLinks()");

    try {
        const getLinksQuery = `
            SELECT url FROM member_web_link
            WHERE member_id = ?
        `;

        const links = await new Promise((resolve, reject) => {
            db.query(getLinksQuery, member_id, (err, result) => {
                if (err) reject(err);
                else resolve(result);
            });
        });

        return res.status(200).json(links);
    } catch (error) {
        console.error(error);
        return res.status(500).json(error);
    }
}

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

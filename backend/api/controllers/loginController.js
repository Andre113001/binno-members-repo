const db = require('../../database/db');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const hash = require('sha256');

// Reusable function to authenticate user and generate token
const authenticateUser = async (accessKey, password) => {
    const hashedAccesskey = hash(accessKey).toString('base64');

    return new Promise((resolve, reject) => {
        db.query(
            `SELECT member_id, member_accesskey, member_password FROM member_i WHERE member_accessKey = ?`,
            [hashedAccesskey],
            async (err, result) => {
                if (err) {
                    reject({ error: 'Internal server error' });
                }

                if (result.length === 0 || !result[0].hasOwnProperty('member_password')) {
                    resolve({ error: 'User not found' });
                }

                const DBpassword = result[0].member_password;

                if (!DBpassword) {
                    resolve({ error: 'User password not found' });
                }

                const passwordMatch = await bcrypt.compare(password, DBpassword);

                if (passwordMatch) {
                    const user = result[0].member_id;

                    const token = jwt.sign(
                        { userId: user.account_id, username: user.name },
                        process.env.JWT_SECRET_KEY,
                        { expiresIn: '1h' }
                    );

                    resolve({ user ,token });
                } else {
                    resolve({ error: 'Authentication failed' });
                }
            }
        );
    });
};

// Controller to handle login request
const login = async (req, res) => {
    const { accessKey, password } = req.body;

    try {
        // Destroy accesskey when logged out or by default
        const result = await authenticateUser(accessKey, password);
        if (result.error) {
            return res.status(401).json(result);
        }
        return res.json(result);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const twoAuth = async (req, res) => {
    
}

module.exports = {
    login,
    twoAuth
};

const db = require('../../database/db');
const sanitizeId = require('../middlewares/querySanitizerMiddleware');

// Reusable function to get a post by ID
const fetchPostById = (postId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM post_i WHERE post_id = ?`;  
        db.query(sql, [sanitizeId(postId)], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

// Controller to get a post by ID
const fetchPost = async (req, res) => {
    const { post_id } = req.params;

    try {
        const result = await fetchPostById(post_id);
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(500).json({ error: 'Post does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to update or create post
const updateCreatePost = async (req, res) => {
    const { post_id, postAuthor, postCategory, postHeading, postText} = req.body;

    try {
        const result = await fetchPostById(post_id);

        if (result.length > 0 && result[0].hasOwnProperty('post_id')) {
            // Update the existing blog
            db.query('UPDATE post_i SET post_author = ?, post_category = ?, post_heading = ?, post_bodytext = ?, post_datemodified=NOW() WHERE post_id = ?',
                 [postAuthor, postCategory, postHeading, postText, result[0].post_id], (updateError, updateRes) => {{
                if (updateError) {
                    return res.status(500).json({ error: 'Failed to update post', updateError });
                }

                if (updateRes.affectedRows > 0) {
                    return res.status(200).json({ message: 'Post updated successfully' });
                } else {
                    return res.status(500).json({ message: 'Failed to update post' });
                }
            }});

        } else {
            // Create a new blog
            db.query('INSERT INTO post_i (post_dateadded, post_author, post_category, post_heading, post_bodytext) VALUES (NOW(), ?, ?, ?, ?)', 
                    [postAuthor, postCategory, postHeading, postText], (createError, createRes) => {
                if (createError) {
                    return res.status(500).json({ error: 'Failed to create Post', createError });
                }
                
                if (createRes.affectedRows > 0) {
                    return res.status(201).json({ message: 'Post created successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to create post' });
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const deletePost = async (req, res) => {
    const {post_id} = req.params;

    try {
        const result = await fetchPostById(post_id);

        if (result.length > 0  && result[0].hasOwnProperty('post_id')) {
            db.query("DELETE FROM post_i WHERE post_id = ?", [post_id], (deleteError, deleteRes) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).json({ error: 'Failed to delete post' });
                }

                if (deleteRes.affectedRows > 0) {
                    return res.status(201).json({ message: 'Post deleted successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to delete post' });
                }            
            });
        } else {
                return res.status(500).json({ error: 'Post does not exist!' })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


module.exports = {
    fetchPost,
    updateCreatePost,
    deletePost,
};


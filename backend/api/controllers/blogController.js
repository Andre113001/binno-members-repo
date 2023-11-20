const db = require('../../database/db');

// Reusable function to get a blog by ID
const getBlogById = async (blogId) => {
    return new Promise((resolve, reject) => {
        db.query('SELECT * FROM blog_i WHERE blog_id = ?', [blogId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

// Controller to get a blog by ID
const getBlog = async (req, res) => {
    const { blogId } = req.params;
    try {
        const result = await getBlogById(blogId);
        if (result.length > 0) {
            return res.json(result);
        } else {
            return res.status(500).json({ error: 'Blog does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Controller to post/update a blog
const postBlog = async (req, res) => {
    const { blogId, authorId, blogTitle, blogContent } = req.body;

    try {
        const result = await getBlogById(blogId);

        if (result.length > 0 && result[0].hasOwnProperty('blog_id')) {
            // Update the existing blog
            db.query('UPDATE blog_i SET blog_title = ?, blog_content = ?, blog_lastmodified=NOW() WHERE blog_id = ?', [blogTitle, blogContent, result[0].blog_id], (updateError, updateRes) => {{
                if (updateError) {
                    return res.status(500).json({ error: 'Failed to update blog' });
                }

                if (updateRes.affectedRows > 0) {
                    return res.status(200).json({ message: 'Blog updated successfully' });
                } else {
                    return res.status(500).json({ message: 'Failed to update blog' });
                }
            }});

        } else {
            // Create a new blog
            db.query('INSERT INTO blog_i (blog_author, blog_dateadded, blog_title, blog_content) VALUES (?, NOW(), ?, ?)', [authorId, blogTitle, blogContent], (createError, createRes) => {
                if (createError) {
                    console.log(createError);
                    return res.status(500).json({ error: 'Failed to create blog' });
                }
                
                if (createRes.affectedRows > 0) {
                    return res.status(201).json({ message: 'Blog created successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to create blog' });
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

// Controller to delete a blog
const deleteBlog = async (req, res) => {
    const { blogId } = req.body;

    try {
        const result = await getBlogById(blogId);

        if (result.length > 0  && result[0].hasOwnProperty('blog_id')) {
            db.query("DELETE FROM blog_i WHERE blog_id = ?", [blogId], (deleteError, deleteRes) => {
                if (deleteError) {
                    console.log(deleteError);
                    return res.status(500).json({ error: 'Failed to delete blog' });
                }

                if (deleteRes.affectedRows > 0) {
                    return res.status(201).json({ message: 'Blog deleted successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to delete blog' });
                }            
            });
        } else {
                return res.status(500).json({ error: 'Blog does not exist!' })
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    getBlog,
    postBlog,
    deleteBlog,
};

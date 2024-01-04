const db = require('../../database/db');

//Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware');
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware');
const fs = require('fs');
const path = require('path');

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

const fetchAllBlogs = async (req, res) => {
    const { userId } = req.params;

    try {
        db.query("SELECT blog_id, blog_author, blog_dateadded, blog_title, blog_content, blog_lastmodified FROM blog_i WHERE blog_author = ?", [userId], (blogError, blogRes) => {
            if (blogError) {
                console.log(blogError);
                return res.status(500).json({ error: 'Failed to fetch blogs', blogError });
            } else {
                return res.status(200).json(blogRes);
            }
        });
    } catch (error) {
        res.status(500).json({ error });
    }
};


const postBlog = async (req, res) => {
    const { blogId, authorId, blogTitle, blogContent } = req.body;

    try {
        // Check if the blog with the given ID exists
        const result = await getBlogById(blogId);

        if (result.length > 0 && result[0].hasOwnProperty('blog_id')) {
            // Update the existing blog
            db.query('UPDATE blog_i SET blog_title = ?, blog_content = ?, blog_lastmodified=NOW() WHERE blog_id = ?', [blogTitle, blogContent, result[0].blog_id], (updateError, updateRes) => {
                if (updateError) {
                    return res.status(500).json({ error: 'Failed to update blog' });
                }

                if (updateRes.affectedRows > 0) {
                    return res.status(200).json({ message: 'Blog updated successfully' });
                } else {
                    return res.status(500).json({ message: 'Failed to update blog' });
                }
            });
        } else {
            const newId = uniqueId.uniqueIdGenerator();
            let newImageName = '';

            // Handle image upload and renaming
            if (req.file) {
                const imageExtension = path.extname(req.file.originalname);
                newImageName = newId + imageExtension;
                const imagePath = path.join(__dirname, '../../public/img/blog-pics', newImageName);
    
                fs.writeFileSync(imagePath, req.file.buffer); // Save the image to the specified path
            }

            // Create a new blog
            db.query('INSERT INTO blog_i (blog_id, blog_author, blog_dateadded, blog_title, blog_content, blog_img) VALUES (?, ?, NOW(), ?, ?, ?)', [newId, authorId, blogTitle, blogContent, newImageName], (createError, createRes) => {
                if (createError) {
                    console.log(createError);
                    return res.status(500).json({ error: 'Failed to create blog' });
                }

                if (createRes.affectedRows > 0) {
                    return res.status(201).json({ message: 'Blog created successfully' });
                } else {
                    return res.status(500).json({ error: 'Failed to create blog', createError });
                }
            });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

// Controller to delete a blog
const deleteBlog = async (req, res) => {
    const { blogId } = req.params;

    try {
        const result = await getBlogById(blogId);

        if (result.length > 0  && result[0].hasOwnProperty('blog_id')) {
            db.query("UPDATE FROM blog_i WHERE blog_id = ?", [blogId], (deleteError, deleteRes) => {
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
    fetchAllBlogs,
    postBlog,
    deleteBlog,
};

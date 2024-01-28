const { default: axios } = require('axios');
const db = require('../../database/db');

//Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware');
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware');
const fs = require('fs');
const path = require('path');

const blog = async (req, res) => {
    try {
        db.query("SELECT * FROM blog_i", [], (err, result) => {
            if (err) {
                return res.status(500).json(err)
            }
    
            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(500).json(err)
            }
        });
    } catch (error) {
        return res.status(500).json(error);
    }
};

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
};

// Controller to get a blog by ID
const getBlog = async (req, res) => {
    const { blogId } = req.params;
    try {
        const result = await getBlogById(blogId);
        if (result.length > 0) {
            const blog = result[0];

            const blog_pic_path = path.join(__dirname, '../../public/img/blog-pics', blog.blog_img);

            // Assuming your image file has the same name as the blog ID with an extension
            // const blog_pic_path = `/static/img/blog-pics/${blog.blog_img}`;

            // Add the imageURL to your response
            return res.json({ ...blog, blog_pic_path });
        } else {
            return res.status(500).json({ error: 'Blog does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getImageBlob = (imagePath) => {
    return fs.readFileSync(imagePath);
};

const getBlogImage = async (req, res) => {
    const { blogId } = req.params;

    db.query("SELECT blog_img FROM blog_i WHERE blog_id = ?", [blogId], (err, result) => {
        if (err) {
            return res.status(500).json(err)
        }

        if (result.length > 0) {
            const imgPath = path.join(__dirname, '../../public/img/blog-pics', result[0].blog_img);
            try {
                const imageBlob = getImageBlob(imgPath);
            
                // Set the appropriate content type for the image
                res.setHeader('Content-Type', 'image/jpeg'); // Adjust the content type based on your image format
            
                // Send the image binary data as the response
                res.send(imageBlob);
            } catch (error) {
                console.error('Error fetching image:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            return res.status(500).json(err)
        }
    });
};

const fetchAllBlogs = async (req, res) => {
    const { userId } = req.params;

    try {
        db.query("SELECT * FROM blog_i WHERE blog_author = ? AND blog_flag = 1", [userId], (blogError, blogRes) => {
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

function limitWords(text, limit) {
    const words = text.split(' ');
    const limitedWords = words.slice(0, limit);
    return limitedWords.join(' ');
}


const postBlog = async (req, res) => {
    const { blogId, authorId, blogTitle, blogContent, blogImg, username, type } = req.body;

    try {
        const result = await getBlogById(blogId);

        if (result.length > 0 && result[0].hasOwnProperty('blog_id')) {
            // Update the existing blog
            db.query(
                'UPDATE blog_i SET blog_title = ?, blog_content = ?, blog_lastmodified = NOW() WHERE blog_id = ?',
                [blogTitle, blogContent, result[0].blog_id],
                (updateError, updateRes) => {
                    if (updateError) {
                        return res.status(500).json({ error: 'Failed to update blog' });
                    }

                    if (updateRes.affectedRows > 0) {
                        return res.status(200).json({ message: 'Blog updated successfully' });
                    } else {
                        return res.status(500).json({ message: 'Failed to update blog' });
                    }
                }
            );
        } else {
            const newId = uniqueId.uniqueIdGenerator();
            let newImageName = '';

            // Handle image upload and renaming
            if (req.file) {
                newImageName = moveFileToDirectory(
                    req.file,
                    newId,
                    '../../public/img/blog-pics'
                );
            }

            newImageName = blogImg.replace(/\\\\/g, '\\');
            shortenedBlogContent = limitWords(blogContent, 60);

            // Create a new blog
            db.query(
                'INSERT INTO blog_i (blog_id, blog_author, blog_dateadded, blog_title, blog_content, blog_img) VALUES (?, ?, NOW(), ?, ?, ?)',
                [newId, authorId, blogTitle, blogContent, newImageName],
                (createError, createRes) => {
                    if (createError) {
                        console.log(createError);
                        return res.status(500).json({ error: 'Failed to create blog' });
                    }

                    if (createRes.affectedRows > 0) {
                        axios.post("https://binno-email-production.up.railway.app/newsletter/", {
                            username: username,
                            type: type,
                            title: blogTitle,
                            img: `blog-pics/${newImageName}`,
                            details: shortenedBlogContent,
                            contentId: newId
                        })

                        return res.status(201).json({ message: 'Blog created successfully' });
                    } else {
                        return res.status(500).json({ error: 'Failed to create blog' });
                    }
                }
            );
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
            db.query("UPDATE blog_i SET blog_flag = 0 WHERE blog_id = ?", [blogId], (deleteError, deleteRes) => {
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
    blog,
    getBlog,
    getBlogImage,
    fetchAllBlogs,
    postBlog,
    deleteBlog,
};

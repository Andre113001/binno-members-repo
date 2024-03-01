const { default: axios } = require('axios');
const db = require('../../database/db');
const fs = require('fs');
const path = require('path');

//Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware');
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware');
const { uploadToLog } = require('../middlewares/activityLogger');
const { updateContentStat, deductContentStat } = require("../middlewares/contentStatUpdater");

/**
 * Retrieves all non-archived blogs from the database.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with the database query or any other error occurs.
 * @returns {Object} Returns a JSON response with the retrieved blogs or an error status.
 */
const getAllBlogs = async (req, res) => {
    console.log(`getAllBlogs() from ${req.ip}`);
    try {
        const getBlogsQuery = `
            SELECT blog.* FROM blog
            INNER JOIN member_profile ON blog.author_id = member_profile.member_id
            WHERE blog.archive = 0 AND member_profile.date_restrict is null AND member_profile.archive = 0
        `;
        db.query(getBlogsQuery, [], (getError, getResult) => {
            if (getError) {
                console.error(getError);
                return res.status(500).json(getError);
            }

            if (getResult.length > 0)
                return res.status(200).json(getResult);
        })
    } catch (error) {
        return res.status(500).json(error);
    }
}

/**
 * Retrieves a blog by its unique identifier from the database.
 *
 * @function
 * @async
 * @param {string} blogId - The unique identifier of the blog to retrieve.
 * @throws {Error} Throws an error if there is an issue with the database query or any other error occurs.
 * @returns {Promise<Array<Object>>} A promise that resolves with an array containing the retrieved blog or rejects with an error.
 */
const getBlogById = async (blogId) => {
    console.log(`getBlogById(${blogId})`);
    return new Promise((resolve, reject) => {
        const getBlogByIdQuery = `
            SELECT blog.* FROM blog
            INNER JOIN member_profile ON blog.author_id = member_profile.member_id
            WHERE blog.blog_id = ? AND blog.archive = 0
            AND member_profile.date_restrict IS NULL AND member_profile.archive = 0
        `;
        db.query(getBlogByIdQuery, [blogId], (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
}

/**
 * Retrieves a blog by its unique identifier from the database and sends the blog information as a JSON response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.blogId - The unique identifier of the blog to retrieve.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the blog, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response with the retrieved blog information or an error status.
 */
const getBlog = async (req, res) => {
    console.log(`getBlog() from ${req.ip}`);
    const { blogId } = req.params;
    try {
        const result = await getBlogById(blogId);
        if (result.length > 0) {
            const blog = result[0]
            const blog_pic_path = path.join(__dirname, '../../public/img/blog-pics', blog.image);

            // Add the imageURL to the response
            return res.json({ ...blog, blog_pic_path });
        } else {
            console.log(`Blog (${blogId}) does not exist`);
            return res.status(500).json({ error: 'Blog does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getImageBlob = (imagePath) => {
    return fs.readFileSync(imagePath)
}

/**
 * Retrieves and sends the image associated with a blog by its unique identifier as the HTTP response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.blogId - The unique identifier of the blog for which to retrieve the image.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the image, the database query, or any other error occurs.
 * @returns {void} Sends the image binary data as the HTTP response or an error status.
 */
const getBlogImage = async (req, res) => {
    console.log(`getBlogImage() from ${req.ip}`)
    const { blogId } = req.params

    // const getBlogImageQuery = "SELECT blog_img FROM blog_i WHERE blog_id = ?";
    // NOTE: new query for the new database - AL
    const getBlogImageQuery = "SELECT image FROM blog WHERE blog_id = ?";
    db.query(getBlogImageQuery, [blogId], (err, result) => {
        if (err) {
            return res.status(500).json(err);
        }

        if (result.length > 0) {
            const imgPath = path.join(__dirname, '../../public/img/blog-pics', result[0].image);
            try {
                const imageBlob = getImageBlob(imgPath);
                // Set the appropriate content type for the image
                // Adjust the content type based on your image format
                res.setHeader('Content-Type', 'image/jpeg');

                // Send the image binary data as the response
                res.send(imageBlob)
            } catch (error) {
                console.error('Error fetching image:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            return res.status(500).json(err);
        }
    });
}

/**
 * Retrieves all non-archived blogs written by a specific author from the database and sends the blog information as a JSON response.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.userId - The unique identifier of the author for whom to retrieve the blogs.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with retrieving the blogs, the database query, or any other error occurs.
 * @returns {void} Sends the retrieved blog information as a JSON response or an error status.
 */
const getAllBlogsByAuthorId = async (req, res) => {
    console.log(`fetchAllBlogs() from ${req.ip}`);
    const { userId } = req.params

    try {
        const getAllBlogsByAuthorQuery = `
            SELECT blog.*, member_profile.name FROM blog
            INNER JOIN member_profile ON blog.author_id = member_profile.member_id
            WHERE blog.author_id = ? AND blog.archive = 0
        `;
        db.query(getAllBlogsByAuthorQuery, [userId], (blogError, blogRes) => {
            if (blogError) {
                console.log(blogError)
                return res.status(500).json({ error: `Failed to fetch blogs for Author (${userId})`, blogError })
            } else {
                return res.status(200).json(blogRes);
            }
        })
    } catch (error) {
        res.status(500).json({ error: error });
    }
}

function limitWords(text, limit) {
    const words = text.split(' ')
    const limitedWords = words.slice(0, limit)
    return limitedWords.join(' ')
}

function getFileExtensionFromDataURL(dataURL) {
    const match = dataURL.match(/^data:image\/([a-zA-Z+]+);base64,/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

/**
 * Creates a new blog or updates an existing blog in the database based on the provided data.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with body and file (if applicable).
 * @param {Object} req.body - The request body containing information about the blog to create or update.
 * @param {string} req.body.blogId - The unique identifier of the blog to update (optional for creating a new blog).
 * @param {string} req.body.authorId - The unique identifier of the blog author.
 * @param {string} req.body.blogTitle - The title of the blog.
 * @param {string} req.body.blogContent - The content/body of the blog.
 * @param {string} req.body.blogImg - The base64-encoded image data of the blog (optional for updating an existing blog).
 * @param {string} req.body.username - The username of the user performing the action.
 * @param {Object} req.file - The file object containing the uploaded image (if applicable).
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with creating or updating the blog, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response indicating the success or failure of the blog creation or update.
 */
const postBlog = async (req, res) => {
    console.log(`postBlog() from ${req.ip}`);
    const {
        blogId,
        authorId,
        blogTitle,
        blogContent,
        blogImg,
        username
    } = req.body

    try {
        const result = await getBlogById(blogId);
        if (result.length > 0) {
            const OldimageId = path.basename(result[0].image, path.extname(result[0].image));
            console.log("OldimageId", OldimageId);
            let currentImg = result[0].image;
            // Delete the old image file
            const oldImagePath = path.join(__dirname, '../../public/img/blog-pics/', result[0].image);

            const base64Image = blogImg.split(';base64,').pop();
            const imageName = OldimageId + '.' + getFileExtensionFromDataURL(blogImg);
            const blogImgPath = path.join(__dirname, '../../public/img/blog-pics/', imageName);

            if (base64Image.length > 0) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old blog image:', err);
                    } else {
                        // console.log('Old image deleted successfully');
                        // Continue with saving the new image
                        fs.writeFile(blogImgPath, base64Image, { encoding: 'base64' }, function(err) {
                            if (err) {
                                console.log('Error saving blog image:', err);
                                // WARN: success variable is undeclared - AL
                                success = false;
                            }
                        });
                    }
                });
                currentImg = imageName;
            }

            const updateBlogQuery = `
                UPDATE blog SET
                title = ?,
                body = ?,
                image = ?,
                date_modified = NOW()
                WHERE blog_id = ?
            `;
            db.query(updateBlogQuery, [blogTitle, blogContent, currentImg, result[0].blog_id],
                (updateError, updateRes) => {
                    if (updateError) {
                        console.log(`Blog (${blogId}) updated failed`);
                        console.error(updateError);
                        return res.status(500).json({ error: 'Failed to update blog' });
                    }

                    if (updateRes.affectedRows > 0) {
                        const logRes = uploadToLog(authorId, blogId, username, 'updated a', 'blog', blogTitle);
                        if (logRes) {
                            console.log(`Blog (${blogId}) updated successfully`);
                            return res.status(200).json({ message: 'Blog updated successfully' });
                        }
                    } else {
                        console.log(`Blog (${blogId}) updated failed`);
                        return res.status(500).json({ message: 'Failed to update blog' });
                    }
                }
            );
        } else {
            const newId = uniqueId.uniqueIdGenerator();
            let newImageName = '';

            // Handle image upload and renaming
            if (req.file) {
                // WARN: moveFileToDirectory() is undeclared - AL
                newImageName = moveFileToDirectory(req.file, newId, '../../public/img/blog-pics');
            }

            newImageName = blogImg.replace(/\\\\/g, '\\')
            const shortenedBlogContent = limitWords(blogContent, 60)

            const createBlogQuery = `
                INSERT INTO blog (
                    blog_id,
                    author_id,
                    date_created,
                    title,
                    body,
                    image
                )
                VALUES (?, ?, NOW(), ?, ?, ?)
            `;
            db.query(createBlogQuery, [newId, authorId, blogTitle, blogContent, newImageName], (createError, createRes) => {
                if (createError) {
                    console.log(createError)
                    return res.status(500).json({ error: 'Failed to create blog' })
                }

                if (createRes.affectedRows > 0) {
                    const logRes = uploadToLog(authorId, newId, username, 'posted a', 'blog', blogTitle);
                    console.log("Posting Email Notification");
                    axios.post(`${process.env.EMAIL_DOMAIN}/newsletter`, {
                        username: username,
                        type: 'Blog',
                        title: blogTitle,
                        img: `blog-pics/${newImageName}`,
                        details: shortenedBlogContent,
                        contentId: newId
                    });

                    if (logRes) {
                        console.log(`Blog (${newId}) created successfully`);
                        updateContentStat("blog");
                        return res.status(201).json({ message: 'Blog created successfully' });
                    }
                } else {
                    return res.status(500).json({ error: 'Failed to create blog' })
                }
            });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

/**
 * Deletes a blog by setting its archive flag to 1 in the database and logs the deletion.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with body.
 * @param {Object} req.body - The request body containing information about the blog to delete.
 * @param {string} req.body.blogId - The unique identifier of the blog to delete.
 * @param {string} req.body.username - The username of the user performing the deletion.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with deleting the blog, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response indicating the success or failure of the blog deletion.
 */
const deleteBlog = async (req, res) => {
    console.log(`deleteBlog() from ${req.ip}`);
    const { blogId, username } = req.body

    try {
        const result = await getBlogById(blogId)
        if (result.length > 0 && result[0].hasOwnProperty('blog_id')) {
            const deleteBlogQuery = "UPDATE blog SET archive = 1 WHERE blog_id = ?";
            db.query(deleteBlogQuery, [blogId], (deleteError, deleteRes) => {
                if (deleteError) {
                    console.log(`Blog (${blogId}) delete failed`);
                    console.error(deleteError);
                    return res.status(500).json({ error: 'Failed to delete blog' });
                }

                if (deleteRes.affectedRows > 0) {
                    const logRes = uploadToLog(result[0].author_id, result[0].blog_id, username, 'deleted a', 'blog', result[0].title);
                    if (logRes) {
                        const blogDateCreated = result[0].date_created.toISOString().split("T")[0];
                        deductContentStat(blogDateCreated, "blog");
                        console.log(`Blog (${blogId}) deleted successfully`);
                        return res.status(201).json({ message: 'Blog deleted successfully' });
                    }
                } else {
                    console.log(`Blog (${blogId}) delete failed`);
                    return res.status(500).json({ error: 'Failed to delete blog' });
                }
            });
        } else {
            return res.status(500).json({ error: 'Blog does not exist!' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    getAllBlogs,
    getBlog,
    getBlogImage,
    getAllBlogsByAuthorId,
    postBlog,
    deleteBlog,
}

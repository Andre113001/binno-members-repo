const { default: axios } = require('axios')
const db = require('../../database/db')
const fs = require('fs')
const path = require('path')

//Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware')
const uniqueId = require('../middlewares/uniqueIdGeneratorMiddleware')
const { uploadToLog } = require('../middlewares/activityLogger');

const blog = async (req, res) => {
    console.log(`blog() from ${req.ip}`);
    try {
        // const getBlogsQuery = `
        //     SELECT blog_i.* FROM blog_i
        //     INNER JOIN member_i ON blog_i.blog_author = member_i.member_id
        //     WHERE blog_flag = 1 AND member_restrict IS NULL AND member_flag = 1
        // `;
        // NOTE: new query for the new database - AL
        const getBlogsQuery = `
            SELECT blog.* FROM blog
            INNER JOIN member_profile ON blog.author_id = member_profile.member_id
            WHERE blog.archive = 0 AND member_profile.date_restrict is null AND member_profile.archive = 0
        `;
        db.query(getBlogsQuery, [], (err, result) => {
            if (err) {
                return res.status(500).json(err)
            }

            if (result.length > 0) {
                return res.status(200).json(result)
            } else {
                return res.status(500).json(err)
            }
        })
    } catch (error) {
        return res.status(500).json(error)
    }
}

// Reusable function to get a blog by ID
const getBlogById = async (blogId) => {
    console.log(`getBlogById(${blogId})`);
    return new Promise((resolve, reject) => {
        // NOTE: new query for the new database - AL
        const getBlogByIdQuery = `
            SELECT blog.* FROM blog
            INNER JOIN member_profile ON blog.author_id = member_profile.member_id
            WHERE blog.blog_id = ? AND blog.archive = 0
            AND member_profile.date_restrict IS NULL AND member_profile.archive = 0
        `;
        db.query(
            getBlogByIdQuery, [blogId], (err, result) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(result)
                }
            }
        )
    })
}

// Controller to get a blog by ID
const getBlog = async (req, res) => {
    console.log(`getBlog() from ${req.ip}`);
    const { blogId } = req.params
    try {
        const result = await getBlogById(blogId)
        if (result.length > 0) {
            const blog = result[0]

            // const blog_pic_path = path.join(
            //     __dirname,
            //     '../../public/img/blog-pics',
            //     blog.blog_img
            // )

            // NOTE: the difference is blog.image - AL
            const blog_pic_path = path.join(
                __dirname,
                '../../public/img/blog-pics',
                blog.image
            )

            // Assuming your image file has the same name as the blog ID with an extension
            // const blog_pic_path = `/static/img/blog-pics/${blog.blog_img}`;

            // Add the imageURL to your response
            return res.json({ ...blog, blog_pic_path })
        } else {
            return res.status(500).json({ error: 'Blog does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const getImageBlob = (imagePath) => {
    return fs.readFileSync(imagePath)
}

const getBlogImage = async (req, res) => {
    console.log(`getBlogImage() from ${req.ip}`)
    const { blogId } = req.params

    // const getBlogImageQuery = "SELECT blog_img FROM blog_i WHERE blog_id = ?";
    // NOTE: new query for the new database - AL
    const getBlogImageQuery = "SELECT image FROM blog WHERE blog_id = ?";
    db.query(
        getBlogImageQuery, [blogId], (err, result) => {
            if (err) {
                return res.status(500).json(err)
            }

            if (result.length > 0) {
                // const imgPath = path.join(__dirname, '../../public/img/blog-pics', result[0].blog_img);
                // NOTE: the difference is result[0].image - AL
                const imgPath = path.join(__dirname, '../../public/img/blog-pics', result[0].image);
                try {
                    const imageBlob = getImageBlob(imgPath)

                    // Set the appropriate content type for the image
                    res.setHeader('Content-Type', 'image/jpeg') // Adjust the content type based on your image format

                    // Send the image binary data as the response
                    res.send(imageBlob)
                } catch (error) {
                    console.error('Error fetching image:', error)
                    res.status(500).send('Internal Server Error')
                }
            } else {
                return res.status(500).json(err)
            }
        }
    )
}

// NOTE: function name should be getAllBlogsByAuthorId(), getAllBlogsById() or getAllBlogsByUser() - AL
const fetchAllBlogs = async (req, res) => {
    console.log(`fetchAllBlogs() from ${req.ip}`);
    const { userId } = req.params

    try {
        // const getAllBlogsByAuthorQuery = `
        //     SELECT blog_i.*, member_settings.setting_institution
        //     FROM blog_i
        //     INNER JOIN member_i ON blog_i.blog_author = member_i.member_id
        //     INNER JOIN member_settings ON member_i.member_setting = member_settings.setting_id
        //     WHERE blog_i.blog_author = ? AND blog_i.blog_flag = 1
        //     ORDER BY blog_dateadded DESC
        // `;
        // NOTE: new query for the new database - AL
        const getAllBlogsByAuthorQuery = `
            SELECT blog.*, member_profile.name FROM blog
            INNER JOIN member_profile ON blog.author_id = member_profile.member_id
            WHERE blog.author_id = ? AND blog.archive = 0
        `;
        db.query(getAllBlogsByAuthorQuery, [userId], (blogError, blogRes) => {
            if (blogError) {
                console.log(blogError)
                return res
                    .status(500)
                    .json({ error: 'Failed to fetch blogs', blogError })
            } else {
                return res.status(200).json(blogRes)
            }
        })
    } catch (error) {
        res.status(500).json({ error })
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
            // const OldimageId = path.basename(result[0].blog_img, path.extname(result[0].blog_img));
            // let currentImg = result[0].blog_img;
            // // Delete the old image file
            // const oldImagePath = path.join(__dirname, '../../public/img/blog-pics/', result[0].blog_img);

            // NOTE: the difference is result[0].image
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

            // NOTE: new query for the new database - AL
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

            // Create a new blog
            // const createBlogQuery = `
            //     INSERT INTO blog_i (
            //         blog_id,
            //         blog_author,
            //         blog_dateadded,
            //         blog_title,
            //         blog_content,
            //         blog_img
            //     )
            //     VALUES (?, ?, NOW(), ?, ?, ?)
            // `;
            // NOTE: new query for the new database - AL
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
                    })

                    if (logRes) {
                        console.log(`Blog (${newId}) created successfully`);
                        return res.status(201).json({ message: 'Blog created successfully' });
                    }
                } else {
                    return res.status(500).json({ error: 'Failed to create blog' })
                }
            })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

// Controller to delete a blog
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
                    const logRes = uploadToLog(
                        result[0].author_id, result[0].blog_id, username, 'deleted a', 'blog', result[0].title
                    );

                    if (logRes) {
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
    blog,
    getBlog,
    getBlogImage,
    fetchAllBlogs,
    postBlog,
    deleteBlog,
}

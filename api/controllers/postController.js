const db = require('../../database/db')

// Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware')
const {
    uniqueIdGenerator,
} = require('../middlewares/uniqueIdGeneratorMiddleware')
const { uploadToLog } = require('../middlewares/activityLogger');
const { updateContentStat } = require('../middlewares/contentStatUpdater');
const fs = require('fs')
const path = require('path')
const axios = require('axios')

/**
 * Fetches all posts that are not archived and belong to members who are not restricted or archived.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with fetching posts or any other error occurs.
 * @returns {void} Responds with a JSON array containing information about posts.
 */
const getAllPosts = async (req, res) => {
    console.log(`getAllPosts() from ${req.ip}`);
    try {
        const getAllPostQuery = `
            SELECT post.* FROM post
            INNER JOIN member_profile ON member_profile.member_id = post.author_id
            WHERE post.archive = 0 AND member_profile.date_restrict IS NULL AND member_profile.archive = 0
        `;
        db.query(getAllPostQuery, (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json(err);
            }

            if (result.length > 0) {
                return res.status(200).json(result);
            } else {
                return res.status(404).json(err);
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Internal server error" });
    }
}

/**
 * Fetches all posts that are not archived and belong to members who are not restricted or archived.
 *
 * @function
 * @async
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with fetching posts or any other error occurs.
 * @returns {void} Responds with a JSON array containing information about posts.
 */
const fetchPostById = (postId) => {
    console.log(`fetchPostById(${postId})`);
    return new Promise((resolve, reject) => {
        const getPostByIdQuery = `
            SELECT post.* FROM post
            INNER JOIN member_profile ON member_profile.member_id = post.author_id
            WHERE post.post_id = ? AND post.archive = 0
            AND member_profile.date_restrict IS NULL AND member_profile.archive = 0
        `;
        db.query(getPostByIdQuery, [sanitizeId(postId)], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    })
}

// Reusable function to get a post by ID
// NOTE: getPostByUserId() or getPostByAuthorId()
const fetchMemberPosts = (userId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const getPostByUserIdQuery = `
            SELECT post_i.*, member_settings.setting_institution
            FROM post_i
            INNER JOIN member_i ON post_i.post_author = member_i.member_id
            INNER JOIN member_settings ON member_i.member_setting = member_settings.setting_id
            WHERE post_author = ? AND post_flag = 1 AND member_restrict IS NULL AND member_flag = 1
        `;
        // NOTE: new query for the new database - AL
        // const getPostByUserIdQuery = `
        //     SELECT * FROM post
        //     WHERE author_id = ? AND archive = 0
        // `;
        db.query(getPostByUserIdQuery, [sanitizeId(userId)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

/**
 * Fetches information about a specific post based on the provided post ID.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.post_id - The unique identifier of the post to fetch.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with fetching the post or any other error occurs.
 * @returns {Object} Returns a JSON response containing information about the requested post.
 */
const getPost = async (req, res) => {
    console.log(`getPost() from ${req.ip}`);
    const { post_id } = req.params;

    try {
        const result = await fetchPostById(post_id);
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            console.log(`404 Post (${post_id}) does not exist`);
            return res.status(404).json({ error: 'Post does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
}

const getMemberPosts = async (req, res) => {
    const { user_id } = req.params

    try {
        const result = await fetchMemberPosts(user_id);
        if (result.length > 0) {
            return res.json(result)
        } else {
            return res.status(404).json({ error: 'Post does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

function getFileExtensionFromDataURL(dataURL) {
    const match = dataURL.match(/^data:image\/([a-zA-Z+]+);base64,/);
    if (match && match[1]) {
        return match[1];
    }
    return null;
}

function limitWords(text, limit) {
    const words = text.split(' ')
    const limitedWords = words.slice(0, limit)
    return limitedWords.join(' ')
}

// Controller to update or create post
const updateCreatePost = async (req, res) => {
    const {
        post_id,
        postAuthor,
        postCategory,
        postHeading,
        postText,
        username,
        postImg,
    } = req.body

    try {
        const result = await fetchPostById(post_id)

        if (result.length > 0 && result[0].hasOwnProperty('post_id')) {
            const OldimageId = path.basename(result[0].post_img, path.extname(result[0].post_img));
            let currentImg = result[0].post_img;
            // Delete the old image file
            const oldImagePath = path.join(__dirname, '../../public/img/post-pics/', result[0].post_img);

            const base64Image = postImg.split(';base64,').pop();
            const imageName = OldimageId + '.' + getFileExtensionFromDataURL(postImg);
            const imgPath = path.join(__dirname, '../../public/img/post-pics/', imageName);

            if (base64Image.length > 0) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old post image:', err);
                    } else {
                        // console.log('Old image deleted successfully');
                        // Continue with saving the new image
                        fs.writeFile(imgPath, base64Image, { encoding: 'base64' }, function(err) {
                            if (err) {
                                console.log('Error saving post image:', err);
                                success = false;
                            }
                        });
                    }
                });
                currentImg = imageName;
            }

            // Update the existing post
            const updateExistingPostQuery = `
                UPDATE post_i SET
                post_author = ?,
                post_category = ?,
                post_heading = ?,
                post_bodytext = ?,
                post_img = ?,
                post_datemodified = NOW()
                WHERE post_id = ?
            `;
            // NOTE: new query for the new database - AL
            // const updateExistingPostQuery = `
            //     UPDATE post SET
            //     author_id = ?,
            //     category = ?,
            //     title = ?,
            //     body = ?,
            //     image = ?,
            //     date_modified = NOW()
            //     WHERE post_id = ?
            // `;
            db.query(
                updateExistingPostQuery,
                [
                    postAuthor,
                    postCategory,
                    postHeading,
                    postText,
                    currentImg,
                    result[0].post_id,
                ],
                (updateError, updateRes) => {
                    {
                        if (updateError) {
                            return res.status(500).json({
                                error: 'Failed to update post',
                                updateError,
                            })
                        }

                        if (updateRes.affectedRows > 0) {
                            const logRes = uploadToLog(
                                postAuthor, post_id, username, 'updated a', 'post', postHeading
                            )

                            if (logRes) {
                                return res.status(200).json({ message: 'Post updated successfully' })
                            }
                        } else {
                            return res
                                .status(500)
                                .json({ message: 'Failed to update post' })
                        }
                    }
                }
            )
        } else {
            const newId = uniqueIdGenerator()
            // Create a new post
            const createPostQuery = `
                INSERT INTO post_i (
                    post_id,
                    post_dateadded,
                    post_author,
                    post_category,
                    post_heading,
                    post_bodytext,
                    post_img
                )
                VALUES (?, NOW(), ?, ?, ?, ?, ?)
            `;
            // NOTE: new query for the new database - AL
            // const createPostQuery = `
            //     INSERT INTO post_i (
            //         post_id,
            //         date_created,
            //         author_id,
            //         category,
            //         title,
            //         body,
            //         image,
            //     )
            //     VALUES (?, NOW(), ?, ?, ?, ?, ?)
            // `;
            db.query(
                createPostQuery,
                [
                    newId,
                    postAuthor,
                    postCategory,
                    postHeading,
                    postText,
                    postImg,
                ],
                (createError, createRes) => {
                    if (createError) {
                        return res.status(500).json({
                            error: 'Failed to create Post',
                            createError,
                        })
                    }

                    if (createRes.affectedRows > 0) {
                        const logRes = uploadToLog(
                            postAuthor, newId, username, 'created a', 'post', postHeading
                        );

                        axios.post(`${process.env.EMAIL_DOMAIN}/newsletter`, {
                            username: username,
                            type: 'Post',
                            title: postHeading,
                            img: `post-pics/${postImg}`,
                            details: limitWords(postText, 60),
                            contentId: newId
                        })

                        updateContentStat('post');

                        if (logRes) {
                            return res.status(201).json({ message: 'Post created successfully' })
                        }
                    } else {
                        return res
                            .status(500)
                            .json({ error: 'Failed to create post' })
                    }
                }
            )
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const deletePost = async (req, res) => {
    const { post_id, username } = req.body

    try {
        const result = await fetchPostById(post_id)

        if (result.length > 0 && result[0].hasOwnProperty('post_id')) {
            const deletePostQuery = `
                UPDATE post_i SET post_flag = 0 WHERE post_id = ?
            `;
            // NOTE: new query for the new database - AL
            // const deletePostQuery = `
            //     UPDATE post SET archive = 1 WHERE post_id = ?
            // `;
            db.query(
                deletePostQuery, [post_id], (deleteError, deleteRes) => {
                    if (deleteError) {
                        console.log(deleteError)
                        return res
                            .status(500)
                            .json({ error: 'Failed to delete post' })
                    }

                    if (deleteRes.affectedRows > 0) {
                        const logRes = uploadToLog(
                            result[0].post_author, result[0].post_id, username, 'deleted a', 'post', result[0].post_heading
                        )

                        if (logRes) {
                            return res.status(201).json({ message: 'Post deleted successfully' })
                        }

                    } else {
                        return res
                            .status(500)
                            .json({ error: 'Failed to delete post' })
                    }
                }
            )
        } else {
            return res.status(500).json({ error: 'Post does not exist!' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const updatePostPin = async (request, result) => {
    const { postId, postAuthorId } = request.body;
    try {
        // unpin all author post
        const unpinAllAuthorPostQuery = `
            UPDATE post_i SET post_pin = 0 WHERE post_author = ?
        `;
        db.query(unpinAllAuthorPostQuery, postAuthorId, (unpinError, unpinResult) => {
            if (unpinError)
                console.error(unpinError);
        });

        const updatePostPinQuery = `
            UPDATE post_i
            SET post_pin = 1
            WHERE post_id = ?
        `;
        db.query(updatePostPinQuery, [postId], (updateError, updateResult) => {
            if (updateError) {
                console.log(updateError)
                return result.status(500).json({ error: 'Failed to update post pin' })
            }

            if (updateResult.affectedRows > 0) {
                return result.status(200).json(`Post Pinned: ${postId}`);
            }
        });
    }
    catch (error) {
        console.error(error)
        return result.status(500).json({ error: 'Internal server error' })
    }
}

const getPostPinned = async (req, res) => {
    try {
        db.query('SELECT * FROM post_i WHERE post_pin = 1', [], (err, result) => {
            if (result.length > 0) {
                return res.status(200).json(result[0]);
            } else {
                return res.status(200).json('No Post Pinned yet');
            }
        });
    } catch (error) {
        console.error(error)
        return result.status(500).json({ error: 'Internal server error' })
    }
}

module.exports = {
    getAllPosts,
    getPost,
    updateCreatePost,
    deletePost,
    getMemberPosts,
    updatePostPin,
    getPostPinned
}

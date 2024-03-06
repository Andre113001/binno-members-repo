const db = require('../../database/db')

// Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware')
const {
    uniqueIdGenerator,
} = require('../middlewares/uniqueIdGeneratorMiddleware')
const { uploadToLog } = require('../middlewares/activityLogger');
const { updateContentStat, deductContentStat } = require('../middlewares/contentStatUpdater');
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
            ORDER BY post.date_created DESC
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
 * @returns {Promise<Array<Object>>} Responds with a JSON array containing information about posts.
 */
const fetchPostById = async (postId) => {
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

/**
 * Fetches posts authored by a specific member based on the provided user ID.
 *
 * @function
 * @async
 * @param {string} userId - The unique identifier of the member whose posts to fetch.
 * @throws {Error} Throws an error if there is an issue with fetching posts or any other error occurs.
 * @returns {Promise<Array<Object>>} A promise that resolves to an array containing information about the posts authored by the member.
 */
const fetchMemberPosts = (userId) => {
    console.log(`fetchMemberPosts(${userId})`);
    return new Promise((resolve, reject) => {
        const getPostByUserIdQuery = `
            SELECT post.* FROM post
            INNER JOIN member_profile ON member_profile.member_id = post.author_id
            WHERE member_profile.date_restrict IS NULL AND member_profile.archive = 0
            AND post.author_id = ? AND post.archive = 0
        `;
        db.query(getPostByUserIdQuery, [sanitizeId(userId)], (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
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

/**
 * Retrieves posts authored by a specific member based on the provided member ID.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with parameters.
 * @param {Object} req.params - Parameters extracted from the request URL.
 * @param {string} req.params.user_id - The unique identifier of the member for whom to fetch posts.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with fetching the member's posts or any other error occurs.
 * @returns {Object} Returns a JSON response containing posts authored by the requested member.
 */
const getMemberPosts = async (req, res) => {
    console.log(`getMemberPosts() from ${req.ip}`);
    const { user_id } = req.params;

    try {
        const result = await fetchMemberPosts(user_id);
        if (result.length > 0) {
            return res.status(200).json(result);
        } else {
            console.log(`Member (${user_id}) has no post/s`);
            return res.status(404).json({ error: "Member has no post/s" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
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

/**
 * Updates or creates a post based on the provided information in the request body.
 *
 * If the post with the specified ID exists, it updates the post. If the post ID is not provided
 * or the post does not exist, a new post is created.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with body.
 * @param {Object} req.body - The request body containing information about the post.
 * @param {string} req.body.post_id - The unique identifier of the post to update. If not provided or empty, a new post will be created.
 * @param {string} req.body.postAuthor - The unique identifier of the post author.
 * @param {string} req.body.postCategory - The category of the post.
 * @param {string} req.body.postHeading - The title or heading of the post.
 * @param {string} req.body.postText - The body or text content of the post.
 * @param {string} req.body.username - The username of the user performing the update or create action.
 * @param {string} req.body.postImg - The base64-encoded image data for the post.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with updating or creating the post, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response indicating the success or failure of the post update or creation.
 */
const updateCreatePost = async (req, res) => {
    console.log(`updateCreatePost() from ${req.ip}`);
    const { post_id, postAuthor, postCategory, postHeading, postText, username, postImg } = req.body;

    try {
        const result = await fetchPostById(post_id);

        if (result.length > 0 && result[0].hasOwnProperty('post_id')) {
            const OldimageId = path.basename(result[0].image, path.extname(result[0].image));
            let currentImg = result[0].post_img;
            // Delete the old image file
            const oldImagePath = path.join(__dirname, '../../public/img/post-pics/', result[0].image);

            const base64Image = postImg.split(';base64,').pop();
            const imageName = OldimageId + '.' + getFileExtensionFromDataURL(postImg);
            const imgPath = path.join(__dirname, '../../public/img/post-pics/', imageName);

            if (base64Image.length > 0) {
                fs.unlink(oldImagePath, (err) => {
                    if (err) {
                        console.error('Error deleting old post image:', err);
                    } else {
                        // Continue with saving the new image
                        fs.writeFile(imgPath, base64Image, { encoding: 'base64' }, function(err) {
                            if (err) {
                                console.log('Error saving post image:', err);
                            }
                        });
                    }
                });
                currentImg = imageName;
            }

            const updateExistingPostQuery = `
                UPDATE post SET
                author_id = ?,
                category = ?,
                title = ?,
                body = ?,
                image = ?,
                date_modified = NOW()
                WHERE post_id = ?
            `;
            const updateExistingPostParameters = [postAuthor, postCategory, postHeading, postText, currentImg, result[0].post_id];
            db.query(updateExistingPostQuery, updateExistingPostParameters, (updateError, updateRes) => {
                if (updateError) {
                    console.log(`501 Post (${result[0].post_id}) update failed`);
                    console.error(updateError);
                    return res.status(501).json({ error: 'Post update failed' });
                }

                if (updateRes.affectedRows > 0) {
                    const logRes = uploadToLog(postAuthor, post_id, username, 'updated a', 'post', postHeading);
                    if (logRes) {
                        return res.status(200).json({ message: 'Post updated successfully' });
                    }
                } else {
                    console.log(`501 Post (${result[0].post_id}) update failed`);
                    return res.status(501).json({ error: 'Post update failed' });
                }
            });
        } else {
            const newId = uniqueIdGenerator()
            const createPostQuery = `
                INSERT INTO post (
                    post_id,
                    date_created,
                    author_id,
                    category,
                    title,
                    body,
                    image
                )
                VALUES (?, NOW(), ?, ?, ?, ?, ?)
            `;
            const createPostParameters = [newId, postAuthor, postCategory, postHeading, postText, postImg];
            db.query(createPostQuery, createPostParameters, (createError, createRes) => {
                if (createError) {
                    console.log("501 Post create failed");
                    console.error(createError);
                    return res.status(500).json({ error: 'Post create failed' });
                }

                if (createRes.affectedRows > 0) {
                    const logRes = uploadToLog(postAuthor, newId, username, 'created a', 'post', postHeading);
                    axios.post(`${process.env.EMAIL_DOMAIN}/newsletter`, {
                        username: username,
                        type: 'Post',
                        title: postHeading,
                        img: `post-pics/${postImg}`,
                        details: limitWords(postText, 60),
                        contentId: newId
                    });

                    if (logRes) {
                        console.log(`201 Post (${newId}) created successfully`);
                        updateContentStat('post');
                        return res.status(201).json({ message: 'Post created successfully' });
                    }
                } else {
                    console.log("501 Post create failed");
                    return res.status(501).json({ error: 'Post create failed' });
                }
            });
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' });
    }
}

/**
 * Deletes a post by setting its archive flag to 1 in the database and logs the deletion.
 *
 * @function
 * @async
 * @param {Object} req - Express request object with body.
 * @param {Object} req.body - The request body containing information about the post to delete.
 * @param {string} req.body.post_id - The unique identifier of the post to delete.
 * @param {string} req.body.username - The username of the user performing the deletion.
 * @param {Object} res - Express response object.
 * @throws {Error} Throws an error if there is an issue with deleting the post, the database query, or any other error occurs.
 * @returns {Object} Returns a JSON response indicating the success or failure of the post deletion.
 */
const deletePost = async (req, res) => {
    console.log(`deletePost() from ${req.ip}`);
    const { post_id, username } = req.body

    try {
        const result = await fetchPostById(post_id);

        if (result.length > 0 && result[0].hasOwnProperty('post_id')) {
            const deletePostQuery = `
                UPDATE post SET archive = 1 WHERE post_id = ?
            `;
            db.query(deletePostQuery, post_id, (deleteError, deleteRes) => {
                if (deleteError) {
                    console.log(`501 Post (${post_id}) delete failed`);
                    console.log(deleteError);
                    return res.status(501).json({ error: 'Post delete failed' });
                }

                if (deleteRes.affectedRows > 0) {
                    const logRes = uploadToLog(result[0].post_author, result[0].post_id, username, 'deleted a', 'post', result[0].post_heading);

                    if (logRes) {
                        const postDateCreated = result[0].date_created.toISOString().split("T")[0];
                        deductContentStat(postDateCreated, "post");
                        console.log(`200 Post (${post_id}) deleted successfully`);
                        return res.status(200).json({ message: 'Post deleted successfully' });
                    }
                } else {
                    console.log(`501 Post (${post_id}) delete failed`);
                    return res.status(501).json({ error: 'Post delete failed' });
                }
            });
        } else {
            console.log(`404 Post (${post_id}) does not exist`);
            return res.status(404).json({ error: 'Post does not exist' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
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
        const getAllPinnedPostQuery = `
            SELECT * FROM post WHERE pin = 1
        `;
        db.query(getAllPinnedPostQuery, (err, result) => {
            if (err) {
                console.log(err);
                return res.status(500).json(err);
            }
            if (result.length > 0) {
                return res.status(200).json(result[0]);
            } else {
                return res.status(404).json({ message: "No posts pinned" });
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
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

const db = require('../../database/db')

// Middlewares
const sanitizeId = require('../middlewares/querySanitizerMiddleware')
const {
    uniqueIdGenerator,
} = require('../middlewares/uniqueIdGeneratorMiddleware')
const { uploadToLog } = require('../middlewares/activityLogger');
const fs = require('fs')
const path = require('path')

const post = async (req, res) => {
    try {
        db.query('SELECT * FROM post_i', [], (err, result) => {
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

// Reusable function to get a post by ID
const fetchPostById = (postId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
            SELECT * FROM post_i WHERE post_id = ?`
        db.query(sql, [sanitizeId(postId)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Reusable function to get a post by ID
const getUserPosts = (userId) => {
    return new Promise((resolve, reject) => {
        // Using parameterized query to prevent SQL injection
        const sql = `
        SELECT * FROM post_i WHERE post_author = ? AND post_flag = 1`
        db.query(sql, [sanitizeId(userId)], (err, data) => {
            if (err) {
                reject(err)
            } else {
                resolve(data)
            }
        })
    })
}

// Controller to get a post by ID
const fetchPost = async (req, res) => {
    const { post_id } = req.params

    try {
        const result = await fetchPostById(post_id)
        if (result.length > 0) {
            return res.json(result)
        } else {
            return res.status(500).json({ error: 'Post does not exist' })
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const fetchMemberPosts = async (req, res) => {
    const { user_id } = req.params

    try {
        const result = await getUserPosts(user_id)
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

// Controller to update or create post
const updateCreatePost = async (req, res) => {
    const {
        post_id,
        postAuthor,
        postCategory,
        postHeading,
        postText,
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
                        fs.writeFile(imgPath, base64Image, { encoding: 'base64' }, function (err) {
                            if (err) {
                                console.log('Error saving post image:', err);
                                success = false;
                            }
                        });
                    }
                });
                currentImg = imageName;
            }

            // console.log({
            //     postId: post_id,
            //     author: postAuthor,
            //     category: postCategory,
            //     title: postHeading,
            //     content: postText,
            //     img: postImg
            // });

            // Update the existing blog
            db.query(
                'UPDATE post_i SET post_author = ?, post_category = ?, post_heading = ?, post_bodytext = ?, post_img = ?, post_datemodified=NOW() WHERE post_id = ?',
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
                            return res
                                .status(200)
                                .json({ message: 'Post updated successfully' })
                        } else {
                            return res
                                .status(500)
                                .json({ message: 'Failed to update post' })
                        }
                    }
                }
            )
        } else {
            console.log('not exists');
            // const newId = uniqueIdGenerator()
            // // Create a new blog
            // db.query(
            //     'INSERT INTO post_i (post_id, post_dateadded, post_author, post_category, post_heading, post_bodytext, post_img) VALUES (?, NOW(), ?, ?, ?, ?, ?)',
            //     [
            //         newId,
            //         postAuthor,
            //         postCategory,
            //         postHeading,
            //         postText,
            //         postImg,
            //     ],
            //     (createError, createRes) => {
            //         if (createError) {
            //             return res.status(500).json({
            //                 error: 'Failed to create Post',
            //                 createError,
            //             })
            //         }

            //         if (createRes.affectedRows > 0) {
            //             return res
            //                 .status(201)
            //                 .json({ message: 'Post created successfully' })
            //         } else {
            //             return res
            //                 .status(500)
            //                 .json({ error: 'Failed to create post' })
            //         }
            //     }
            // )
        }
    } catch (error) {
        console.error(error)
        return res.status(500).json({ error: 'Internal server error' })
    }
}

const deletePost = async (req, res) => {
    const { post_id } = req.params

    try {
        const result = await fetchPostById(post_id)

        if (result.length > 0 && result[0].hasOwnProperty('post_id')) {
            db.query(
                'UPDATE post_i SET post_flag = 0 WHERE post_id = ?',
                [post_id],
                (deleteError, deleteRes) => {
                    if (deleteError) {
                        console.log(deleteError)
                        return res
                            .status(500)
                            .json({ error: 'Failed to delete post' })
                    }

                    if (deleteRes.affectedRows > 0) {
                        return res
                            .status(201)
                            .json({ message: 'Post deleted successfully' })
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

module.exports = {
    post,
    fetchPost,
    updateCreatePost,
    deletePost,
    fetchMemberPosts,
}

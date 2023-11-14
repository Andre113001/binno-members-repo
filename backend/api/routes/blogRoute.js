const express = require('express');
const router = express.Router();
const blogController = require('../controllers/blogController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/get-blog/:blogId', blogController.getBlog);
router.post('/post-blog', blogController.postBlog);
router.post('/delete-blog', blogController.deleteBlog);

module.exports = router;

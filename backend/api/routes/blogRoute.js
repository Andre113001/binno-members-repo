const express = require('express');
const router = express.Router();
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const blogController = require('../controllers/blogController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/get-blog/:blogId', blogController.getBlog);
router.get('/all/:userId', blogController.fetchAllBlogs);

router.post('/post-blog', upload.single('image'), blogController.postBlog);

router.get('/delete-blog/:blogId', blogController.deleteBlog);

module.exports = router;

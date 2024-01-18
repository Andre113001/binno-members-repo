const express = require('express')
const router = express.Router()
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

const blogController = require('../controllers/blogController')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// const activityLogging = require('../middlewares/activityLogging')
// router.use(activityLogging)
router.get('/', blogController.blog);
router.get('/img/:blogId', blogController.getBlogImage);

router.get('/:blogId', blogController.getBlog)
router.get('/user/:userId', blogController.fetchAllBlogs)

router.post('/post', blogController.postBlog)

router.get('/delete/:blogId', blogController.deleteBlog)

module.exports = router

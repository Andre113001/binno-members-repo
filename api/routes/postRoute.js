const express = require('express')
const router = express.Router()
const postController = require('../controllers/postController')
const multer = require('multer')
const storage = multer.memoryStorage()
const upload = multer({ storage: storage })

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

// const activityLogging = require('../middlewares/activityLogging')
// router.use(activityLogging)

router.get('/', postController.getAllPosts);
router.get('/:post_id', postController.getPost);
router.get('/user/:user_id', postController.getMemberPosts);
router.post('/upload', upload.single('image'), postController.updateCreatePost)
router.post('/delete', postController.deletePost)
router.post('/pin', postController.updatePostPin)
router.get('/pin/get', postController.getPostPinned)

module.exports = router

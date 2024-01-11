const express = require('express')
const router = express.Router()
const socMedController = require('../controllers/socMedPostController')

router.use(express.json())
router.use(express.urlencoded({ extended: true }))

const activityLogging = require('../middlewares/activityLogging')
router.use(activityLogging)

router.get('/:post_id', socMedController.fetchPost)
router.post('/uploadUpdate', socMedController.updateCreatePost)
router.get('/delete-post/:post_id', socMedController.deletePost)

module.exports = router

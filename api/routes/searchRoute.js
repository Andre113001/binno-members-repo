const express = require('express');
const router = express.Router();

const searchController = require('../controllers/searchController');

router.post('/blog', searchController.searchBlog);
router.post('/event', searchController.searchEvent);
router.post('/guide', searchController.searchGuides);

module.exports = router;
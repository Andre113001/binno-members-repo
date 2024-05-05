const express = require('express');
const router = express.Router();

const publicController = require('../controllers/publicController');

router.get('/blogs', publicController.fetchBlogs);
router.get('/events', publicController.fetchEvents);
router.get('/guides', publicController.fetchGuides);
router.get('/links/:member_id', publicController.fetchCompanyLinks);
router.get('/class/:member_id', publicController.fetchEnablerClass);

router.get('/faq', publicController.fetchFaq);
router.post('/uaq', publicController.postUaq);

router.get('/metrics', publicController.fetchCountMetrics);


router.get('/profile/company', publicController.fetchCompanyProfile);
router.get('/profile/enabler', publicController.fetchEnablerProfile);
router.get('/profile/mentor', publicController.fetchMentorProfile);



module.exports = router;
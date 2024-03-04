const express = require('express');
const router = express.Router();
const guideController = require('../controllers/guideController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// const activityLogging = require('../middlewares/activityLogging')
// router.use(activityLogging)

router.get('/', guideController.getAllGuides);
router.get('/:guideId', guideController.getGuide);
router.get('/user/:authorId', guideController.getAllGuidesByAuthorId);
router.get('/page/:pageId', guideController.getGuidePageByPageId);
router.post('/page/save/:pageId', guideController.saveGuidePageElements);

router.post('/delete/:guideId', guideController.deleteGuide);
router.get('/delete/page/:page_id', guideController.deletePage);

router.post('/create_guide', guideController.createGuide);
router.post('/create_page', guideController.createUpdateGuidePage);
router.post('/change_img', guideController.changeCoverPic);
router.post('/change_title', guideController.changeTitlePage);

module.exports = router;

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
router.post('/page/save/:pageId', guideController.saveElementsController);

router.post('/delete/:program_id', guideController.deleteProgam);
router.get('/delete/page/:page_id', guideController.deletePage);

router.post('/change_img', guideController.changeCoverPic);
router.post('/change_title', guideController.changeTitlePage);
router.post('/create_program', guideController.createProgram);
router.post('/create_page', guideController.createUpdatePage);

module.exports = router;

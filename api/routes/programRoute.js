const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));


// const activityLogging = require('../middlewares/activityLogging')
// router.use(activityLogging)

router.get('/:program_id', programController.fetchProgram);
router.get('/user/:id', programController.fetchAllPrograms);
router.get('/page/:pageId', programController.fetchProgramPage);
router.post('/page/save/:pageId', programController.saveElementsController);

router.get('/delete/:program_id', programController.deleteProgam);
router.get('/delete/page/:page_id', programController.deletePage);

router.post('/create_program', programController.createUpdateProgram);
router.post('/create_page', programController.createUpdatePage);

module.exports = router;
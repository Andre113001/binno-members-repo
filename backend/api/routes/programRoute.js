const express = require('express');
const router = express.Router();
const programController = require('../controllers/programController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

router.get('/:program_id', programController.fetchProgram);
router.get('/page/:pageId', programController.fetchProgramPage);

router.get('/delete-program/:program_id', programController.deleteProgam);
router.get('/delete-page/:page_id', programController.deletePage);

router.post('/create-update-program', programController.createUpdateProgram);
router.post('/create-update-page', programController.createUpdatePage);

module.exports = router;
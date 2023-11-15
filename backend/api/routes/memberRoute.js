const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

router.use(express.json());
router.use(express.urlencoded({ extended: true }));

// 11/15/2023 - Include specify startup enabler and company

router.get('/member/:member_id', memberController.getMember);
router.post('/update-profile', memberController.updateProfile);
router.get('/change-status/:member_id', memberController.changeStatus);

module.exports = router;

const express = require('express');
const router = express.Router();
const memberController = require('../controllers/memberController');

// 11/15/2023 - Include specify startup enabler and company

router.get('/member/:member_id', memberController.getMember);

module.exports = router;

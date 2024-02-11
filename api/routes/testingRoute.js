const express = require('express')
const router = express.Router()

const testController = require('../controllers/testController');

router.post('/', testController.testComponent)

module.exports = router;